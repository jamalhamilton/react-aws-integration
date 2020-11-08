import React from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import Webcam from "react-webcam";
import AWS from "aws-sdk";
import QRCode from "qrcode.react";
import { Redirect, withRouter } from "react-router";

import config from "../config/front_config";
import { Divider } from "rsuite";

var videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
};

var mobileConstraints = {
    width: 1280,
    height: 720,
    facingMode: { exact: "environment" },
};


class IDAuth extends React.Component {
    // webcamRef = React.useRef(null);

    constructor(props) {
        super();

        let query = new URLSearchParams(props.location.search);
        let userToken = query.get('token');
        if (!userToken) {
            window.location.href = '/';
            return;
        }

        let authStep = parseInt(userToken.substr(-1)) - 8;
        userToken = userToken.substr(0, userToken.length - 1);

        this.webcamRef = React.createRef();

        this.state = {
            userToken: userToken,
            authStep: authStep,

            verifyURL: config.siteUrl + config.api.verifyID + '?token=' + userToken + '9',

            isPhotoTaken: false,
            imageSrc: '',

            photo_source: '',
            photo_target: '',

            uploadedPhoto: '',
            uploadedId: '',

            blob: '',

            resultMsg: '',
            msgColor: 'black',
            resultBtnStatus: 0,

            uploadingProgress: 0,
            showLoadingIcon: {display: 'none'},
            apiTmr: 0
        };

        this.photoCapture = this.photoCapture.bind(this);
        this.photoTake = this.photoTake.bind(this);
        this.comparePhoto = this.comparePhoto.bind(this);
        this.navToVerify = this.navToVerify.bind(this);

        var osStatus = this.getMobileOperatingSystem();
        if(osStatus == 'Android' || osStatus == 'iOS'){
            videoConstraints = mobileConstraints;
        }
    }

    getMobileOperatingSystem() {
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

    componentDidMount() {
        var that = this;
        var { userToken } = this.state;
        fetch(config.api.getUser, {
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify({ token: "mQXA8d7YQGsj5FLgDstt" }),
        }).then(res => res.json()).then(data => {
            debugger
            if (data['status']) {
                if (data.status) {
                    that.state.photo_source = data.data.id + '_face.jpg';
                    that.state.photo_target = data.data.id + '_id.jpg';
                }
                that.setState({
                    uploadedPhoto: data.data.verify_photo,
                    uploadedId: data.data.verify_idcard,
                });
            }
        }).catch(error => {
            debugger
            window.location.href="/";
        });

        clearInterval(this.state.apiTmr);
        if (!userToken) return;
        this.state.apiTmr = setInterval(() => {
            if (that.state.uploadedId) {
                clearInterval(that.state.apiTmr);
                return;
            }
            fetch(config.api.getUser, {
                headers: { 'Content-Type': 'application/json' },
                method: "POST",
                body: JSON.stringify({ token: "mQXA8d7YQGsj5FLgDstt" }),
            }).then(res => res.json()).then(data => {
                that.setState({
                    uploadedPhoto: data.data.verify_photo,
                    uploadedId: data.data.verify_idcard,
                });
                if (data.data.verify_idcard) clearInterval(that.state.apiTmr);
            }).catch(error => {
                debugger
                window.location.href="/";
            });
        }, 3000);

    }

    photoTake() {
        var that = this;
        var { isPhotoTaken } = this.state;

        var imageSrc = '';
        if (!isPhotoTaken) {
            imageSrc = this.webcamRef.current.getScreenshot();
            if (!imageSrc) {
                this.setState({
                    msgColor: 'red',
                    resultMsg: 'Camera is not connected!!',
                    imageSrc: ''
                });
                return;
            }
        }

        this.setState({
            isPhotoTaken: !isPhotoTaken,
            imageSrc: imageSrc
        });

        console.log('--------- imageSrc');
    }

    photoCapture() {
        var that = this;
        var { authStep, userToken, imageSrc } = this.state;

        /////////////////////////////////        
        // that.setState({
        //     authStep: authStep + 1,
        // });
        // return;
        /////////////////////////////////

        var { photo_source, photo_target } = this.state;

        AWS.config.update({
            accessKeyId: config.aws.accessKey,
            secretAccessKey: config.aws.secretKey,
            region: config.aws.region
        })
        var bucket = new AWS.S3({ params: { Bucket: config.aws.bucket } })
        var fileName = photo_source;
        if (authStep === 1) fileName = photo_target;

        imageSrc = this.dataURItoBlob(imageSrc);
        var imgFile = new File([imageSrc], fileName);
        // var params = { Key: imgFile.name, ContentType: imgFile.type, Body: imgFile, ServerSideEncryption: 'None' };
        var params = { Key: imgFile.name, ContentType: "image/jpeg", Body: imgFile };
        that.setState({
            msgColor: 'black',
            resultMsg: '',
            uploadingProgress: .1,
        })
        bucket.putObject(params, function (err, data) {
            if (!err) {
                // alert('Uploading done!!!');
                var verifyType = { verify_photo: fileName };
                if (authStep === 1) verifyType = { verify_idcard: fileName };
                verifyType.token = userToken
                fetch(config.api.updateUserInfo, {
                    headers: { 'Content-Type': 'application/json' },
                    method: "POST",
                    body: JSON.stringify(verifyType),
                }).then(res => res.json()).then(data => {
                    if (data.status) {
                        if (authStep === 1){
                            window.location.href="/idsuccess";
                        }
                        else{
                            that.setState({
                                msgColor: 'black',
                                resultMsg: 'Uploading done.',
                            });
                            console.log('-------- uploaded: ', data);
                            setTimeout(function () {
                                that.setState({
                                    authStep: 0,
                                    resultMsg: '',
                                    imageSrc: '',
                                    isPhotoTaken: false,
                                    resultBtnStatus: 0,
                                    uploadingProgress: 0
                                });
                            }, 1000);
                        }
                    }
                    console.log('data', data.data)
                });
            } else {
                alert(err.message);
                return false;
            }
        }).on('httpUploadProgress', function (progress) {
            console.log('---- uploading progress: ', progress);
            console.log('---- uploading progress: ', progress.loaded / progress.total * 100);

            var percent = parseInt(progress.loaded / progress.total * 100);
            that.setState({
                uploadingProgress: percent
            })
        });
    }

    navToVerify() {
        var that = this;
        var { userToken } = this.state;
        this.setState({
            showLoadingIcon: {display: 'inline-block'}
        });
        fetch(config.api.getUser, {
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify({
                token: userToken
            }),
        }).then(res => res.json()).then(data => {
            if (data.status) {
                var errMsg = ''
                if (!data.data.verify_idcard) errMsg = "You didn't upload id card photo.";
                if (!data.data.verify_photo) errMsg = "You didn't upload face photo.";
                if (errMsg) {
                    that.setState({
                        msgColor: 'red',
                        resultMsg: errMsg,
                        showLoadingIcon: {display: 'none'}
                    });
                    return;
                }
                that.setState({
                    photo_source: data.data.verify_photo,
                    photo_target: data.data.verify_idcard,
                })
                that.comparePhoto();

            } else {
                that.setState({
                    msgColor: 'red',
                    resultMsg: 'Server connection failed.',
                    showLoadingIcon: {display: 'none'}
                });
            }
        });

    }

    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var binary = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // console.log('-- mimeString: ', mimeString);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: mimeString });
    }

    comparePhoto() {
        var that = this;
        var { resultBtnStatus, userToken } = that.state;
        if (resultBtnStatus) {
            that.setState({
                authStep: 0,
                resultBtnStatus: 0,
                showLoadingIcon: {display: 'none'}
            })
       
            return;
        }
        const bucket = config.aws.bucket; // the bucketname without s3://

        // const awsConfig = new AWS.Config({
        //     accessKeyId: config.aws.accessKey,
        //     secretAccessKey: config.aws.secretKey,
        //     region: config.aws.region
        // })

        var { photo_source, photo_target } = this.state;

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
                    Name: photo_source,
                },
            },
            TargetImage: {
                S3Object: {
                    Bucket: bucket,
                    Name: photo_target,
                },
            },
            SimilarityThreshold: 70,
        };

        console.log('-- compare 0')
        try {
            client.compareFaces(params, function (err, response) {
                if (err) {
                    console.log(err, err.stack); // an error occurred                    
                    that.setState({
                        resultBtnStatus: 1,
                        msgColor: 'red',
                        resultMsg: 'You didn\'t upload exact personal photo.',
                        showLoadingIcon: {display: 'none'}
                    })
                  
                    return;
                }
                if (!response.FaceMatches.length) {
                    that.setState({
                        resultBtnStatus: 1,
                        msgColor: 'red',
                        resultMsg: 'User and ID is not matched!',
                        showLoadingIcon: {display: 'none'}
                    })
                    return;
                }
               
                response.FaceMatches.forEach((data) => {
                   
                    let position = data.Face.BoundingBox;
                    let similarity = data.Similarity;
                   
                    fetch(config.api.updateUserInfo, {
                        headers: { 'Content-Type': 'application/json' },
                        method: "POST",
                        body: JSON.stringify({
                            token: userToken,
                            verify_result: similarity
                        }),
                    }).then(res => res.json()).then(data => {
                        if (data.status) {
                            console.log('-------- uploaded: ', data);

                            fetch(config.api.sendResultMail, {
                                headers: { 'Content-Type': 'application/json' },
                                method: "POST",
                                body: JSON.stringify({
                                    token: data.token,
                                    similarity: similarity
                                }),
                            }).then(response => response.json())
                            .then(data => {
                             
console.log(data);
                                if(data.status){
                                    window.location.href = data.data;
                                }
                                else{
                                    that.setState({
                                        resultBtnStatus: 1,
                                        msgColor: 'red',
                                        resultMsg: data.data,
                                        showLoadingIcon: {display: 'none'}
                                    });
                                }
                              });

                        }
                        console.log('data', data.data)
                    });
                }); // for response.faceDetails
            });
        } catch (err) {
            that.setState({
                resultBtnStatus: 1,
                msgColor: 'red',
                resultMsg: 'You didn\'t upload exact personal photo.'
            })
            console.log(err);
        }
    }

    render() {
        let { authStep } = this.state;

        return (
            <Container style={{ textAlign: "center" }}>
                {true && (
                    <div>
                        <Row style={{ marginTop: 50 }}>
                            <Col>
                                <h1>
                                    Step 2. Verify Your Information
                                </h1>
                            </Col>
                        </Row>
                        <Divider />
                        <Row style={{ marginTop: 30 }}>
                            <Col>
                                <h4>Your Face Photo</h4>
                                <img src={this.state.imageSrc}
                                    style={{
                                        marginBottom: 6,
                                        display: (this.state.isPhotoTaken ? 'inline-block' : 'none')
                                    }}
                                />
                                <Webcam
                                    style={{ display: (!this.state.isPhotoTaken ? 'inline-block' : 'none') }}
                                    videoConstraints={videoConstraints}
                                    screenshotFormat="image/jpeg"
                                    ref={this.webcamRef}
                                />
                                <p>
                                    <Button
                                        variant="primary"
                                        onClick={this.photoTake}
                                    >
                                        {(this.state.isPhotoTaken) ? 'Retake Photo' : 'Take A Photo'}
                                    </Button>
                                    <Button
                                        style={{
                                            marginLeft: 30,
                                            display: (this.state.isPhotoTaken ? 'inline-block' : 'none')
                                        }}
                                        variant="primary"
                                        onClick={this.photoCapture}
                                    >
                                        Upload
                                    </Button>
                                </p>
                            </Col>
                            {authStep === 0 && (
                                <Col>
                                    <h4>Your ID card</h4>
                                    <QRCode
                                        value={this.state.verifyURL}
                                        size={256}
                                        level={'Q'}
                                        includeMargin={true}
                                    />
                                    <p><a href={this.state.verifyURL}>{this.state.verifyURL}</a></p>
                                    {this.state.uploadedId ? (
                                        <p style={{ color: 'red' }}>ID has been submitted.</p>
                                    ) : (
                                            <p>Please scan this link and upload id card on your phone.</p>
                                        )}
                                </Col>
                            )}
                        </Row>
                        <Divider />
                        <Row style={{ marginTop: 30 }}>
                            <Col>
                                <Button 
                                    variant="primary"
                                    onClick={this.navToVerify}
                                >
                                   <i style={this.state.showLoadingIcon} className="fa fa-spinner fa-spin"></i>
                                    Verify Information
                                </Button>
                            </Col>
                        </Row>
                        {this.state.uploadingProgress > 0 && (
                            <div>
                                <Row style={{ marginTop: 30 }}>
                                    <Col></Col>
                                    <Col>
                                        <ProgressBar
                                            now={this.state.uploadingProgress}
                                            label={this.state.uploadingProgress + '%'}
                                            animated
                                        />
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </div>
                        )}
                    </div>
                )}

                {(authStep === 1) && (
                    <div>
                        <Row style={{ marginTop: 50 }}>
                            <Col>
                                <h1>
                                    Upload Your ID Card
                                </h1>
                            </Col>
                        </Row>
                        <Divider />
                        <Row style={{ marginTop: 30 }}>
                            <Col>
                                <img src={this.state.imageSrc}
                                    style={{
                                        marginBottom: 6,
                                        display: (this.state.isPhotoTaken ? 'inline-block' : 'none')
                                    }}
                                />
                                <Webcam
                                    style={{ display: (!this.state.isPhotoTaken ? 'inline-block' : 'none') }}
                                    videoConstraints={videoConstraints}
                                    screenshotFormat="image/jpeg"
                                    ref={this.webcamRef}
                                />
                            </Col>
                        </Row>
                        <Divider />
                        <Row style={{ marginTop: 30 }}>
                            <Col>
                                <p>
                                    <Button
                                        variant="primary"
                                        onClick={this.photoTake}
                                    >
                                        {(this.state.isPhotoTaken) ? 'Retake Photo' : 'Take A Photo'}
                                    </Button>
                                    <Button
                                        style={{
                                            marginLeft: 30,
                                            display: (this.state.isPhotoTaken ? 'inline-block' : 'none')
                                        }}
                                        variant="primary"
                                        onClick={this.photoCapture}
                                    >
                                        Upload
                                    </Button>
                                </p>
                            </Col>
                        </Row>
                        {this.state.uploadingProgress > 0 && (
                            <div>
                                <Row style={{ marginTop: 30 }}>
                                    <Col></Col>
                                    <Col>
                                        <ProgressBar
                                            now={this.state.uploadingProgress}
                                            label={this.state.uploadingProgress + '%'}
                                            animated
                                        />
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </div>
                        )}
                    </div>
                )}

                {authStep === 2 && (
                    <div>
                        <Row style={{ marginTop: 50 }}>
                            <Col>
                                <h1>Step 2. Verify Your Identity</h1>
                            </Col>
                        </Row>
                        <Divider />
                        <Row style={{ marginTop: 30 }}>
                            <Col>
                                <Button
                                    variant="primary"
                                    onClick={this.comparePhoto}
                                >
                                    {this.state.resultBtnStatus ? 'Upload again' : 'Verify'}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}
                <Row style={{ marginTop: 30, marginBottom: 30, color: this.state.msgColor }}>
                    <Col>{this.state.resultMsg}</Col>
                </Row>
                {this.state.blob !== '' &&
                    <img src={this.state.blob} alt="blob" />
                }
            </Container>
        );
    }
}

export default withRouter(IDAuth);
