let controller = {};
var nodemailer = require('nodemailer');
var config = require('./config/server_config');
const userController = require('./user.controller');

// var generateRandomString = (len) => {
//     if (!len) len = 8;
//     var characters = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
//     var charactersLength = characters.length;
//     var randomString = '';
//     for (var i = 0; i < len; i++) {
//         randomString += characters[parseInt(Math.random() * charactersLength)];
//     }
//     return randomString;
// };

controller.getTest = (req, res, next) => {
    console.log("server get testing");
    res.send({
        status: true,
        data: "testing Ok"
    });
};


controller.sendMail = (req, res, next) => {
    console.log('send mail');
    var transporter = nodemailer.createTransport({
        service: config.smtp.service,
        auth: {
            user: config.smtp.auth.user,
            pass: config.smtp.auth.pass
        }
    });
    let errMsg = '';
    const userData = req.body;
    if (!userData.token) errMsg = 'User Info is not provided.';
    if (errMsg) {
        res.send({ status: false, data: errMsg });
        return;
    }
    console.log('-- provided UserInfo : ', userData);
    const params = {
        TableName: 'users',
        FilterExpression: "#cg = :data",
        ExpressionAttributeNames: {
            "#cg": "token",
        },
        ExpressionAttributeValues: {
            ":data": userData.token,
        }
    };
    userController.getUserInfo(params)
        .then(data => {
            if (data && data.id && data.token) {
                var userInfo = data;
                var verifyURL = config.serverRoot + config.verifyURL + "?token=" + userInfo.token;
                console.log(verifyURL);
                console.log('userInfo', userInfo.candidate_name_first);
                var mailOptions = {
                    from: config.smtp.auth.user,
                    to: userInfo.candidate_email,
                    subject: 'Interverify Support Team',
                    html: `
                    <h2>Hi ${userInfo.candidate_name_first}.</h2>
                    <p>You are confirmed for a video interview on ${userInfo.date_of_interview}. You are required to verify your identity before proceeding to the interview. The process should be quick and seamless. Please begin the verification process not more than 5 minutes prior to your interview.</p> 
                    <p>When you are ready to begin the verification process, please click the link below.</p>
                    <p><a href="${verifyURL}">${verifyURL}</a></p>
                    <h2>Things to Note</h2>
                    <ul>
                    <li> Please have a valid government issued form of identification for this process.</li>
                    <li> Make sure you are in a well lit room.</li>
                    <li> Using a smartphone for the ID verification process will be ideal.</li>
                    <li> If you have any difficulties in the verification process, please email <a href="mailto:support@interverify.co">support@interverify.co</a> with the subject “Urgent” and make sure to include your full name.</li>
                    </ul>
                    <h2>Good luck!</h2>
                `
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.send({ status: true, data: `Email sent. token:` + userInfo.candidate_email });
                    }
                });
            }
        })
        .catch(err => {
            res.send({
                success: false,
                message: err
            });
        });

};


controller.sendResultMail = (req, res, next) => {
    var transporter = nodemailer.createTransport({
        service: config.smtp.service,
        auth: {
            user: config.smtp.auth.user,
            pass: config.smtp.auth.pass
        }
    });
    let errMsg = '';
    const userData = req.body;
    if (!userData.token) errMsg = 'User Info is not provided.';
    if (errMsg) {
        res.send({ status: false, data: errMsg });
        return;
    }
    console.log('-- provided UserInfo : ', userData);
    const params = {
        TableName: 'users',
        FilterExpression: "#cg = :data",
        ExpressionAttributeNames: {
            "#cg": "token",
        },
        ExpressionAttributeValues: {
            ":data": userData.token,
        }
    };
    userController.getUserInfo(params)
        .then(data => {
            if (data && data.id && data.token) {
                const userInfo = data;
                var mailOptions = {
                    from: config.smtp.auth.user,
                    to: userInfo.interviewer_email,
                    subject: 'Interverify Support Team',
                    html: `
                        <h2>Hello ${userInfo.interviewer_name_first}.</h2>
                        <p>Your Interview candidate has successfully verified their Identity using InterVerify.</p>
                        <p>Candidate Name: ${(userInfo.name_match && userInfo.name_match === 'match') ? 'Match' : 'Not Match'}</p>
                        <p>Candidate ID: ${(userInfo.id_verification_result && userInfo.id_verification_result === 'verified') ? 'Verified' : 'Not Verified'}</p>
                        <p>Candidate Photo: ${config.aws_s3_endpoint}${userInfo.verify_photo}</p>
                        <p>You may now begin interview process by clicking the link below.</p>
                        <p><a href="${userInfo.social_link}">${userInfo.social_link}</a></p>
                    `
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {

                        res.send({ status: true, data: userInfo.social_link });
                    }
                });
            } else {
                res.send({ status: false, data: `User info is not exist. token:` + userData.token });
                return;
            }
        })
        .catch(err => {
            res.send({
                success: false,
                message: err
            });
        });
};

controller.sendRegisterSuccessMailToRecruiter = (req, res, next) => {
    console.log('send mail');
    var transporter = nodemailer.createTransport({
        service: config.smtp.service,
        auth: {
            user: config.smtp.auth.user,
            pass: config.smtp.auth.pass
        }
    });
    let errMsg = '';
    const userData = req.body;
    if (!userData.token) errMsg = 'User Info is not provided.';
    if (errMsg) {
        res.send({ status: false, data: errMsg });
        return;
    }
    console.log('-- provided UserInfo : ', userData);
    const params = {
        TableName: 'users',
        FilterExpression: "#cg = :data",
        ExpressionAttributeNames: {
            "#cg": "token",
        },
        ExpressionAttributeValues: {
            ":data": userData.token,
        }
    };
    userController.getUserInfo(params)
        .then(data => {
            if (data && data.id && data.token) {
                var userInfo = data;
                var verifyURL = config.serverRoot + config.verifyURL + "?token=" + userInfo.token;
                console.log(verifyURL);
                console.log('userInfo', userInfo.candidate_name_first);
                var mailOptions = {
                    from: config.smtp.auth.user,
                    to: userInfo.recruiter_email,
                    subject: 'Interverify Support Team',
                    html: `
                    <h2>Hi ${userInfo.recruiter_first_name}.</h2>
                    <p>You have submitted an Interverify request for ${userInfo.candidate_name_first} ${userInfo.candidate_name_last} for interview on ${userInfo.date_of_interview}.</p>
                    <p>Candidate will begin verification not more than 5 minutes before the Interview. Once verification is complete, you will be notified with the results.</p> 
                    <p>If you need to make changes to this submission, please email <a href="mailto:support@interverify.co">support@interverify.co</a> with the changes. Please include candidate name in the email.</p>
                `
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.send({ status: true, data: `Email sent. token:` + userInfo.candidate_email });
                    }
                });
            }
        })
        .catch(err => {
            res.send({
                success: false,
                message: err
            });
        });

};

module.exports = controller;

