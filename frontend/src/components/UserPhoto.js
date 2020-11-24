import React, { useEffect, useState } from 'react';
import { Spinner } from "react-bootstrap";
import { BrowserRouter as Router, useLocation, useHistory } from "react-router-dom";
import { Divider } from "rsuite";
import config from "../config/front_config";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import Webcam from "react-webcam";
import AWS from "aws-sdk";

let videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
};

const mobileConstraints = {
    width: 1280,
    height: 720,
    facingMode: { exact: "environment" },
};

const UserPhoto = () => {

    const [isLoading, setIsLoading] = useState();
    const [imageSrc, setImageSrc] = useState();
    const [isPhotoTaken, setIsPhotoTaken] = useState();
    const [displayMessage, setDisplayMessage] = useState();

    const history = useHistory();
    const [user, setUser] = useState();
    const webcamRef = React.createRef();

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const token = query.get('token');

    useEffect(() => {
        getUserWithToken();
        var osStatus = getMobileOperatingSystem();
        if (osStatus == 'Android' || osStatus == 'iOS') {
            videoConstraints = mobileConstraints;
        }
    }, []);

    const getMobileOperatingSystem = () => {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        if (/JavaFX/.test(userAgent)) {
            return 'JavaFx';
        };
        return "unknown";
    }

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
                        showErrorMessage('success', 'All your verification has been completed!');
                        history.push('/verifisuccess?token=' + token);
                    }
                } else {
                    history.push('/verifyID?token=' + token);
                }
            } else {
                showErrorMessage('error', 'User not found!');
            }
        }).catch(err => {
            setIsLoading(false);
            showErrorMessage('error', 'Unable to fetch user info!');
        })
    }

    const takePhoto = () => {
        if (webcamRef && webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                showErrorMessage('error', 'Camera is not connected!!');
                return;
            }
            setImageSrc(imageSrc);
            setIsPhotoTaken(true);
        }
    }

    const uploadPhoto = () => {
        if (!imageSrc) { showErrorMessage('error', 'please take photo!'); return; }
        AWS.config.update({
            accessKeyId: config.aws.accessKey,
            secretAccessKey: config.aws.secretKey,
            region: config.aws.region
        })
        const bucket = new AWS.S3({ params: { Bucket: config.aws.bucket } });
        const imageToUpload = dataURItoBlob(imageSrc);
        const fileName = token + '_face.jpg';
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
                        verify_photo: fileName
                    }),
                }).then(res => res.json()).then(data => {
                    setIsLoading(false);
                    if (data.status) {
                        setUser(data);
                        showErrorMessage('success', 'photo uploaded successfully!');
                        verificationResult(data);
                    } else {
                        showErrorMessage('error', 'photo upload faild!');
                    }
                }).catch(err => {
                    setIsLoading(false);
                    showErrorMessage('error', 'photo upload faild!');
                });
            } else {
                showErrorMessage('error', 'photo upload faild!');
            }
        });
    }

    const verificationResult = (userData) => {
        console.log("userData", userData);
        if (!(userData && userData.verify_photo && userData.verify_idcard)) {
            showErrorMessage('error', 'some of the required user information nor found!, please try again!');
            return;
        }
        const bucket = config.aws.bucket;
        const photoSrc = userData.verify_photo;
        const idSrc = userData.verify_idcard;
        if (photoSrc && idSrc) {
            setIsLoading(true);
            AWS.config.update({
                accessKeyId: config.aws.accessKey,
                secretAccessKey: config.aws.secretKey,
                region: config.aws.region
            })
            const client = new AWS.Rekognition();
            const params = {
                SourceImage: {
                    S3Object: {
                        Bucket: bucket,
                        Name: photoSrc,
                    },
                },
                TargetImage: {
                    S3Object: {
                        Bucket: bucket,
                        Name: idSrc,
                    },
                },
                SimilarityThreshold: 70,
            };
            client.compareFaces(params, function (err, response) {
                setIsLoading(false);
                if (err) {
                    showErrorMessage('error', 'You didn\'t upload exact personal photo.');
                    return;
                }
                if (!response.FaceMatches.length) {
                    showErrorMessage('error', 'User and ID is not matched!');
                    return;
                }
                response.FaceMatches.forEach((data) => {
                    const similarity = data.Similarity;
                    setIsLoading(true);
                    fetch(config.api.updateUserInfo, {
                        headers: { 'Content-Type': 'application/json' },
                        method: "POST",
                        body: JSON.stringify({
                            token,
                            verify_result: similarity
                        }),
                    }).then(res => res.json()).then(data => {
                        setIsLoading(false);
                        if (data.status) {
                            fetch(config.api.sendResultMail, {
                                headers: { 'Content-Type': 'application/json' },
                                method: "POST",
                                body: JSON.stringify({
                                    token,
                                    similarity: similarity
                                }),
                            }).then(response => response.json())
                                .then(data => {
                                    if (data.status) {
                                        showErrorMessage('success', 'verification success!');
                                        history.push('/verifisuccess?token=' + token);
                                    }
                                    else {
                                        showErrorMessage('error', 'Error sending mail!');
                                    }
                                });
                        } else {
                            showErrorMessage('error', 'Error on verification!');
                        }
                    }).catch(err => {
                        setIsLoading(false);
                    });
                });
            });
        }
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
            <section>
                <div class="container">
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
                                    <li class="active">
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
                                <h3 class="text-center">Photo Verification</h3>
                                <div class="row form___Row pt-5">
                                    <div class="col-md-12 col-12 ">
                                        <div class="wrap400">
                                            <h4>Your Face Photo</h4>
                                            <div class="photoHolder">
                                                {isPhotoTaken ? <img src={imageSrc} /> :
                                                    <Webcam
                                                        style={{ height: 300, width: 380 }}
                                                        audio={false}
                                                        videoConstraints={videoConstraints}
                                                        screenshotFormat="image/jpeg"
                                                        ref={webcamRef}
                                                    />}
                                            </div>
                                            <div>
                                                <button onClick={() => isPhotoTaken ? setIsPhotoTaken(false) : takePhoto()} type="button" class="cameraBtn"><img src="images/camera_ic.svg" />{isPhotoTaken ? 'Retake Photo' : 'Take Photo'}</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12 col-12 btnBootomCol">
                                        <div class="form-group text-center pt-5">
                                            <a onClick={() => uploadPhoto()} class="btn_1">Submit</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showMessage()}
        </div>
    );
}

export default UserPhoto;