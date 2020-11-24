import React, { useEffect, useState } from 'react';
import { Container, Row, Spinner } from "react-bootstrap";
import { BrowserRouter as Router, useLocation, useHistory } from "react-router-dom";
import config from "../config/front_config";
import AWS from "aws-sdk";

const VerificationBase = () => {

    const [verificationErrors, setVerificationErrors] = useState();
    const [isLoading, setIsLoading] = useState();
    const history = useHistory();
    const [displayMessage, setDisplayMessage] = useState();

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const token = query.get('token');

    const vouchedBaseLoaded = (userData) => {
        var vouched = window.Vouched({
            appId: config.vouched_PUBLIC_KEY,
            crossDevice: true,
            crossDeviceQRCode: true,
            onSubmit: ({ stage, attempts, job }) => {
                console.log('submit', { stage, attempts, job });
            },
            onCamera: ({ hasCamera, hasPermission }) => {
                console.log('onCamera', { hasCamera, hasPermission });
            },
            onInit: ({ token }) => {
                console.log('initialization');
            },
            onDone: (job) => {
                console.log(job);
                onVerificationCompleted(job, userData);
            },
            stepTitles: {
                FrontId: 'Upload ID',
                Face: 'Upload Headshot',
                Done: 'Finished'
            },
            content: {
                cameraButton: 'Take a Photo',
                crossDeviceTitle: 'ID Verification',
                crossDeviceInstructions: 'We need to verify your identity. This requires government-issued photo ID as well as selfie. Please follow the instructions below to continue the verification process on your phone',
                crossDeviceSuccess: 'Verification is complete, continue on your desktop',
                review: 'Verification complete',
                upperSuccess: 'Your photo uploads are complete!',
                success: 'Please close this window to return your online visit.',
                lowerSuccess: 'Thank you.',
                upperIdInstructions:
                    'Before you start please have an approved Government ID (e.g. Passport / Driving License) in your hand.',
                lowerIdInstructions: 'Please take a photo of your ID now',
                upperFaceInstructions: 'Time to take a photo.',
                lowerFaceInstructions: 'Please take a clear picture of your face, and make sure it does not include:',
                upperFailure: 'Try Again',
                verifyFail: 'Sorry for the inconvenience',
                lowerFailure:
                    "The photo you shared can't be used for validation. Please take another picture, making sure the image of your face or your ID is clear."
            },
            theme: {
                name: 'verbose',
                font: "'Avenir', sans-serif",
                fontColor: '#646769',
                iconLabelColor: '#413d3a',
                bgColor: '#FFF',
                baseColor: '#62ACDE',
                navigationDisabledBackground: '#b3def1',
                navigationDisabledText: '#a3d7ee',
                navigationActiveText: '#413d3a',
                iconColor: '#f6f5f3',
                iconBackground: '#62ACDE'
            }
        });
        vouched.mount("#vouched-element");
    }

    const initVouchedBase = (userData) => {
        const script = document.createElement("script");
        script.src = "https://static.vouched.id/widget/vouched.js";
        script.async = true;
        script.onload = () => vouchedBaseLoaded(userData);
        document.body.appendChild(script);
    }

    const onVerificationCompleted = (verificationResult, user) => {
        if (verificationResult && user && user.token) {
            let nameMatch = 'nomatch';
            const errors = verificationResult.errors;
            if (errors && errors.length) {
                showErrorMessage('error', 'verification Not completed!');
                setVerificationErrors(errors);
            } else {
                console.log("verificationResult", verificationResult);
                console.log("user Result", user);
                if (verificationResult['result'] && verificationResult['result']['firstName'] && user['candidate_name_first'] && verificationResult['result']['lastName'] && user['candidate_name_last']) {
                    if ((verificationResult['result']['firstName'].toLowerCase()) === (user['candidate_name_first'].toLowerCase()) && (verificationResult['result']['lastName'].toLowerCase()) === (user['candidate_name_last'].toLowerCase())) {
                        nameMatch = 'match';
                    }
                }
                getPhotoIDandUpdateToAWS(verificationResult['token'], nameMatch);
            }
        }
    }

    const getPhotoIDandUpdateToAWS = (verificationToken, nameMatch) => {
        setIsLoading(true);
        fetch(config.api.getPhotoId, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                verificationToken
            })
        }).then(res => res.json()).then(data => {
            setIsLoading(false);
            if (data && data["status"]) {
                uploadPhotoID(data["data"], nameMatch);
            } else {
                showErrorMessage('error', 'Verification not compleded!');
            }
        })
            .catch(err => {
                showErrorMessage('error', 'Verification not compleded!');
                setIsLoading(false);
            });
    }

    const dataURItoBlob = (dataURI) => {
        var binary = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: mimeString });
    }

    const uploadPhotoID = (imageToUpload, nameMatch) => {
        imageToUpload = dataURItoBlob(imageToUpload);
        AWS.config.update({
            accessKeyId: config.aws.accessKey,
            secretAccessKey: config.aws.secretKey,
            region: config.aws.region
        })
        const bucket = new AWS.S3({ params: { Bucket: config.aws.bucket } });
        const fileName = token + '_id.jpg';
        const imgFileToUpload = new File([imageToUpload], fileName);
        const params = { Key: imgFileToUpload.name, ContentType: "image/jpeg", Body: imgFileToUpload };
        setIsLoading(true);
        bucket.putObject(params, function (err, data) {
            setIsLoading(false);
            if (!err) {
                setIsLoading(true);
                fetch(config.api.updateUserInfo, {
                    headers: { 'Content-Type': 'application/json' },
                    method: "POST",
                    body: JSON.stringify({
                        token,
                        verify_idcard: fileName,
                        id_verification_result: "verified",
                        name_match: nameMatch
                    }),
                }).then(res => res.json()).then(data => {
                    setIsLoading(false);
                    if (data.status) {
                        history.push('/userphoto?token=' + token);
                    } else {
                        showErrorMessage('error', 'Sorry, for the Inconvenience caused by us!. please try again in some time.');
                    }
                }).catch(err => {
                    setIsLoading(false);
                    showErrorMessage('error', 'photo upload faild!');
                });
            } else {
                showErrorMessage('error', (err && err.message) ? err.message : 'photo upload faild!');
            }
        });
    }

    useEffect(() => {
        getUserWithToken();
    }, []);

    const getUserWithToken = () => {
        setIsLoading(true);
        fetch(config.api.getUser, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                token
            })
        }).then(res => res.json()).then(data => {
            setIsLoading(false);
            if (data && data['data'] && data['data']['token']) {
                if (data['data']['id_verification_result'] == "verified") {
                    if (data['data']['verify_result']) {
                        showErrorMessage('success', 'All your verification has been completed');
                        history.push('/verifisuccess?token=' + token);
                    } else {
                        history.push('/userphoto?token=' + token);
                    }
                }
                initVouchedBase(data['data']);
            } else {
                showErrorMessage('error', 'User not found!');
            }
        }).catch(err => {
            showErrorMessage('error', 'Unable to fetch user info!');
            setIsLoading(false);
        })
    }

    const showErrorMessage = (type, message) => {
        setDisplayMessage({
            type,
            message
        });
        setTimeout(() => {
            setDisplayMessage();
        }, 3000);
    }

    const showMessage = () => {
        if (displayMessage && displayMessage.type && displayMessage.message) {
            if (displayMessage.type === 'success') {
                return (
                    <div class="submitMsg"><img src="images/checked_ic.svg" />{displayMessage.message}</div>
                );
            } else {
                return (
                    <div class="errorMsg"><i class="fas fa-times-circle errorMsgIcon"></i>{displayMessage.message}</div>
                );
            }
        }
    }

    return (
        <div class="innerPage ptb_100">
            {isLoading ? <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: 'rgba(16, 16, 16, 0.5)',
                    zIndex: 999
                }}>
                <Spinner style={{ textAlign: 'center', marginTop: '30%' }} animation="border" />
            </div> : null}
            <section class="">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="text-center">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} class="text-center">
                                    <img style={{ height: 50 }} src="images/weblogo.png" />
                                    <a style={{ fontSize: 50, marginLeft: 10 }} href="/">interverify</a>
\                                </div>
                                <ul class="processHead">
                                    <li class="active">
                                        <span class="round_no">1</span>
                                        <span class="t__">ID Verification</span>
                                    </li>
                                    <li >
                                        <span class="round_no">2</span>
                                        <span class="t__">Photo Verification</span>
                                    </li>
                                    <li >
                                        <span class="round_no">3</span>
                                        <span class="t__">Finished</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="whiteWrap">
                                {/* <h3 class="text-center">ID Verification</h3>
                                <div class="row form___Row pt-5"> */}
                                {/* <div class="col-md-12 col-12 qrCol__">
                                        <div class="wrap400 ml-auto yourIDM50">
                                            <h4>QR code from vouched</h4>
                                            <div class="qrHolder">
                                                <img src="images/qrCode.png" />
                                            </div>
                                            <div>
                                                <p>Text from vouched</p>
                                            </div>
                                        </div>
                                    </div> 
                                    <div>*/}
                                <div id='vouched-element' />
                            </div>
                            {(verificationErrors && verificationErrors.length) ?
                                <div style={{ color: 'red', marginTop: 20 }}>
                                    <h4 class="text-center">Verification Not completed!</h4>
                                    <ul class="text-center" style={{ fontSize: 25 }}>
                                        {verificationErrors.map((error, index) => <li key={index}>{error.message}</li>)}
                                    </ul>
                                </div>
                                : null}
                        </div>
                    </div>
                </div>
            </section>
            {showMessage()}
        </div>
    );
}

export default VerificationBase;