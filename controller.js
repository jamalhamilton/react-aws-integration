let controller = {};
var nodemailer = require('nodemailer');
var config = require('./config/server_config');

var generateRandomString = (len) => {
    if (!len) len = 8;
    var characters = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    var charactersLength = characters.length;
    var randomString = '';
    for (var i = 0; i < len; i++) {
        randomString += characters[parseInt(Math.random() * charactersLength)];
    }
    return randomString;
};

controller.getTest = (req, res, next) => {
	console.log("server get testing");
    res.send({
        status: true,
        data: "testing Ok"
    });
};

controller.sendMail = (req, res, next) => {
    var transporter = nodemailer.createTransport({
        service: config.smtp.service,
        auth: {
            user: config.smtp.auth.user,
            pass: config.smtp.auth.pass
        }
    });
    req.getConnection((err, conn) => {
        var errMsg = '';
        if (err) errMsg = `Database Error : ${err}`;

        var userData = req.body;
        if (!userData.token) errMsg = 'User Info is not provided.';

        if (errMsg) {
            res.send({ status: false, data: errMsg });
            return;
        }
        console.log('-- provided UserInfo : ', userData);
        conn.query("select * from tbl_user where token='" + userData.token + "'", (err, rows) => {
            if (err) {
                res.send({ status: false, data: `Database Error on reading: ${err}` });
                return;
            }

            if (!rows.length) {
                res.send({ status: false, data: `User info is not exist. token:` + userData.token });
                return;
            }
            var userInfo = rows[0];
            var verifyURL = config.serverRoot + config.verifyURL + "?token=" + userInfo.token + "8";
            console.log(verifyURL);
            var mailOptions = {
                from: config.smtp.auth.user,
                to: userInfo.candidate_email,
                subject: 'Interverify Support Team',
                html: `
                    <h2>Hello ${userInfo.candidate_name_first} ${userInfo.candidate_name_last}.</h2>
                    <p>You have been invited for an Recruiter.</p> 
                    <p>Please click the follow link to start the verification first.</p>
                    <p><a href="${verifyURL}">${verifyURL}</a></p>
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

        });
        return;
    });
};

controller.getUser = (req, res, next) => {
    req.getConnection((err, conn) => {
        var errMsg = '';
        if (err) errMsg = `Database Error : ${err}`;

        var userData = req.body;
        if (!userData.token) errMsg = 'User Info is not provided.';

        if (errMsg) {
            res.send({ status: false, data: errMsg });
            return;
        }
        console.log('-- provided UserInfo : ', userData);
        conn.query("select id, verify_photo, verify_idcard from tbl_user where token='" + userData.token + "'", (err, rows) => {
            if (err) {
                res.send({ status: false, data: `Database Error on reading: ${err}` });
                return;
            }

            if (!rows.length) {
                res.send({ status: false, data: `User info is not exist. token:` + userData.token });
                return;
            }

            res.send({
                status: true,
                data: rows[0],
                token: rows[0].token
            });

        });
        return;
    });
};

controller.updateUserInfo = (req, res, next) => {
    req.getConnection((err, conn) => {
        var errMsg = '';
        if (err) errMsg = `Database Error : ${err}`;

        var userData = req.body;
        if (!userData.token) errMsg = 'User Info is not provided.';

        var sql = '';
        for (var key in userData) {
            if (key === 'token') continue;
            if (userData[key]) {
                if (sql !== '') sql += ',';
                sql += key + "='" + userData[key] + "'";
            }
        }
        if (!sql) errMsg = 'User information is not provided.';

        if (errMsg) {
            res.send({ status: false, data: errMsg });
            return;
        }
        console.log('-- provided UserInfo : ', userData);
        conn.query("select token from tbl_user where token='" + userData.token + "'", (err, rows) => {
            if (err) {
                res.send({ status: false, data: `Database Error on reading: ${err}` });
                return;
            }

            if (!rows.length) {
                res.send({ status: false, data: `User info is not exist. token:` + userData.token });
                return;
            }

            conn.query("update tbl_user set " + sql + " where token='" + rows[0].token + "'", (err, result) => {
                if (err) {
                    res.send({ status: false, data: `Database Error on update: ${err}` });
                    return;
                }

                res.send({
                    status: true,
                    data: result.message,
                    token: rows[0].token
                });
            });

        });
        return;
    });
};

controller.registerUser = (req, res, next) => {
    req.getConnection((err, conn) => {
        var errMsg = '';
        if (err) errMsg = `Database Error : ${err}`;

        var userData = req.body;
        if (!userData.candidate_email) errMsg = 'Candidate Email is not provided.';
        var sql = '';
        for (var key in userData) {
            if (userData[key]) {
                if (sql !== '') sql += ',';
                sql += key + "='" + userData[key] + "'";
            }
        }
        if (!sql) errMsg = 'User information is not provided.';

        if (errMsg) {
            res.send({ status: false, data: errMsg });
            return;
        }
        console.log('-- provided UserInfo : ', req.body);
        conn.query("select token from tbl_user where candidate_email='" + userData.candidate_email + "'", (err, rows) => {
            if (err) {
                res.send({ status: false, data: `Database Error on reading: ${err}` });
                return;
            }

            if (rows.length) {
                conn.query("update tbl_user set " + sql + " where token='" + rows[0].token + "'", (err, result) => {
                    if (err) {
                        res.send({ status: false, data: `Database Error on update: ${err}` });
                        return;
                    }

                    res.send({
                        status: true,
                        data: result.message,
                        token: rows[0].token
                    });
                });
            } else {
                var token = generateRandomString(20);
                conn.query("insert into tbl_user set " + sql + ",token='" + token + "'", (err, result) => {
                    if (err) {
                        res.send({ status: false, data: `Database Error on insert: ${err}` });
                        return;
                    }

                    res.send({
                        status: true,
                        data: 'Inserted ' + result.affectedRows + ' records.',
                        token: token
                    });
                });
            }
        });
        return;
    });
};

module.exports = controller;
