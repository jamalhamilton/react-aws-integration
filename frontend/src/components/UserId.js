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

const UserId = () => {

    const [isLoading, setIsLoading] = useState();
    const [imageSrc, setImageSrc] = useState();
    const [isPhotoTaken, setIsPhotoTaken] = useState();
    const history = useHistory();
    const [user, setUser] = useState();
    const [uploadingProgress, setUploadingProgress] = useState();
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
                        alert('All your verification has been completed!.');
                        history.push('/verifisuccess?token=' + token);
                    } else if (!(data['data']['verify_photo'])) {
                        history.push('/userphoto?token=' + token);
                    }
                } else {
                    history.push('/verifyID?token=' + token);
                }
            }
        }).catch(err => {
            setIsLoading(false);
        })
    }

    const takePhoto = () => {
        if (webcamRef && webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                alert('Camera is not connected!!');
                return;
            }
            setImageSrc(imageSrc);
            setIsPhotoTaken(true);
        }
    }

    const uploadPhoto = () => {
        AWS.config.update({
            accessKeyId: config.aws.accessKey,
            secretAccessKey: config.aws.secretKey,
            region: config.aws.region
        })
        const bucket = new AWS.S3({ params: { Bucket: config.aws.bucket } });
        const imageToUpload = dataURItoBlob(imageSrc);
        const fileName = user.id + '_id.jpg';
        const imgFileToUpload = new File([imageToUpload], fileName);
        const params = { Key: imgFileToUpload.name, ContentType: "image/jpeg", Body: imgFileToUpload };
        setUploadingProgress(.1);
        bucket.putObject(params, function (err, data) {
            setUploadingProgress(0);
            if (!err) {
                setIsLoading(true);
                fetch(config.api.updateUserInfo, {
                    headers: { 'Content-Type': 'application/json' },
                    method: "POST",
                    body: JSON.stringify({
                        token,
                        verify_idcard: fileName
                    }),
                }).then(res => res.json()).then(data => {
                    setIsLoading(false);
                    if (data.status) {
                        setUser(data);
                        verificationResult();
                    } else {
                        alert('photo upload faild!');
                    }
                }).catch(err => {
                    setIsLoading(false);
                    alert('photo upload faild!');
                });
            } else {
                alert((err && err.message) ? err.message : 'photo upload faild!');
            }
        }).on('httpUploadProgress', function (progress) {
            const percent = parseInt(progress.loaded / progress.total * 100);
            setUploadingProgress(percent);
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

    const verificationResult = () => {
        const bucket = config.aws.bucket;
        const photoSrc = user.verify_photo;
        const idSrc = user.verify_idcard;
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
                    alert('You didn\'t upload exact personal photo.');
                    return;
                }
                if (!response.FaceMatches.length) {
                    alert('User and ID is not matched!');
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
                                        alert('verification success!');
                                        history.push('/verifisuccess?token=' + token);
                                    }
                                    else {
                                        alert('Error sending mail!.');
                                    }
                                });
                        } else {
                            alert('Error on verification!');
                        }
                    }).catch(err => {
                        setIsLoading(false);
                    });
                });
            });
        }
    }

    const photoContainer = () => {
        return (
            <>
                <Row style={{ marginTop: 50 }}>
                    <Col>
                        <h1>Step 2. Verify Your Information</h1>
                    </Col>
                </Row>
                <Divider />
                <Row style={{ marginTop: 30 }}>
                    <Col>
                        <h4>Upload Your ID Card</h4>
                        {isPhotoTaken ?
                            <div>
                                <Row style={{ justifyContent: 'center' }}>
                                    <img src={imageSrc} style={{ marginBottom: 6, alignSelf: 'center', display: 'inline-block' }} />
                                </Row>
                                <Row style={{ justifyContent: 'space-evenly' }}>
                                    <Button style={{ marginLeft: 30, display: 'inline-block' }} variant="warning" onClick={() => uploadPhoto()}>Upload</Button>
                                    <Button variant="primary" onClick={() => setIsPhotoTaken(false)}>Retake Photo</Button>
                                </Row>
                            </div>
                            :
                            <div>
                                <Webcam
                                    style={{ display: 'inline-block' }}
                                    audio={false}
                                    videoConstraints={videoConstraints}
                                    screenshotFormat="image/jpeg"
                                    ref={webcamRef}
                                />
                                <p>
                                    <Button variant="primary" onClick={() => takePhoto()}>Take A Photo</Button>
                                </p>
                            </div>
                        }
                    </Col>
                </Row>
            </>
        );
    }

    return (
        <Router>
            <Container style={{ textAlign: "center" }}>
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
                        <li class="active">Identity Verification</li>
                        <li>Photo Verification</li>
                        <li>Verification finished</li>
                    </ul>
                </Row>
                {photoContainer()}
                {uploadingProgress > 0 && <ProgressBar now={uploadingProgress} label={uploadingProgress + '%'} animated />}
            </Container>
        </Router>
    );
}

export default UserId;