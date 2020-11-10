import React, { useEffect, useState } from 'react';
import { Container, Row, Spinner } from "react-bootstrap";
import { BrowserRouter as Router, useLocation, useHistory } from "react-router-dom";
import config from "../config/front_config";
import AWS from "aws-sdk";

const VerificationBase = () => {

    const [verificationErrors, setVerificationErrors] = useState();
    const [isLoading, setIsLoading] = useState();
    const history = useHistory();
    const [user, setUser] = useState();

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const token = query.get('token');

    const vouchedBaseLoaded = () => {
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
                onVerificationCompleted(job);
            },
            stepTitles: {
                FrontId: 'Upload ID',
                Face: 'Upload Headshot',
                Done: 'Finished'
            },
            content: {
                cameraButton: 'Take a Photo',
                crossDeviceTitle: 'Identity Verification',
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
                font: 'Open Sans',
                fontColor: '#413d3a',
                iconLabelColor: '#413d3a',
                bgColor: '#FFF',
                baseColor: '#62ACDE',
                navigationDisabledBackground: '#b3def1',
                navigationDisabledText: '#a3d7ee',
                // logo: {
                //     src: 'https://static.vouched.id/customers/blocktriangle/logo.jpg',
                //     style: {
                //         maxWidth: 150,
                //         marginBottom: 30
                //     }
                // },
                navigationActiveText: '#413d3a',
                iconColor: '#f6f5f3',
                iconBackground: '#62ACDE'
            }
        });
        vouched.mount("#vouched-element");
    }

    const initVouchedBase = () => {
        const script = document.createElement("script");
        script.src = "https://static.vouched.id/widget/vouched.js";
        script.async = true;
        script.onload = () => vouchedBaseLoaded();
        document.body.appendChild(script);
    }

    const onVerificationCompleted = (verificationResult) => {
        if (verificationResult) {
            const errors = verificationResult.errors;
            if (errors && errors.length) {
                setVerificationErrors(errors);
            } else {
                alert("ID Verification completed successfully!");
                getPhotoIDandUpdateToAWS(verificationResult['token']);
            }
        }
    }

    const getPhotoIDandUpdateToAWS = (verificationToken) => {
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
                uploadPhotoID(data["data"]);
            } else {
                alert('Sorry, Verification not compleded!.');
            }
        })
            .catch(err => {
                alert('Sorry, Verification not compleded!.');
                setIsLoading(false);
            });
    }

    const uploadPhotoID = (imageToUpload) => {
        AWS.config.update({
            accessKeyId: config.aws.accessKey,
            secretAccessKey: config.aws.secretKey,
            region: config.aws.region
        })
        const bucket = new AWS.S3({ params: { Bucket: config.aws.bucket } });
        const fileName = user.id + '_id.jpg';
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
                        id_verification_result: "verified"
                    }),
                }).then(res => res.json()).then(data => {
                    setIsLoading(false);
                    if (data.status) {
                        history.push('/userphoto?token=' + token);
                    } else {
                        alert('Sorry, for the Inconvenience caused by us!. please try again in some time.');
                    }
                }).catch(err => {
                    setIsLoading(false);
                    alert('photo upload faild!');
                });
            } else {
                alert((err && err.message) ? err.message : 'photo upload faild!');
            }
        });
    }

    useEffect(() => {
        initVouchedBase();
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
                setUser(data['data']);
                if (data['data']['id_verification_result'] == "verified") {
                    if (data['data']['verify_result']) {
                        alert('All your verification has been completed!.');
                        history.push('/verifisuccess?token=' + token);
                    } else {
                        history.push('/userphoto?token=' + token);
                    }
                }
            } else {
                alert('Sorry, User not found!.');
            }
        }).catch(err => {
            alert('Sorry, User not found!.');
            setIsLoading(false);
        })
    }

    return (
        <Router>
            <Container style={{ textAlign: 'center' }}>
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
                <Row style={{ justifyContent: 'center' }}>
                    <ul class="progressbar">
                        <li>Identity Verification</li>
                        <li>Photo Verification</li>
                        <li>Verification finished</li>
                    </ul>
                </Row>
            </Container>
            <div style={{ marginTop: 100 }}>
                <div id='vouched-element' />
                <div style={{ marginLeft: '40%' }}>
                    <h4>Scan and open the link which is on QR code!.</h4>
                </div>
            </div>
            {(verificationErrors && verificationErrors.length) ?
                <div style={{ marginLeft: '40%', color: 'red' }}>
                    <h2>Verification Not completed!</h2>
                    <ul style={{ fontSize: 25 }}>
                        {verificationErrors.map((error, index) => <li key={index}>{error.message}</li>)}
                    </ul>
                </div>
                : null}
            {/* <p onClick={() => updateUserAndNavToPhotoVerify()}>click</p> */}
        </Router>
    );
}

export default VerificationBase;