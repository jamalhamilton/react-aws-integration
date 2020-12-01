let controller = {};
var nodemailer = require('nodemailer');
var config = require('./config/server_config');
const userController = require('./user.controller');
const moment = require('moment-timezone');

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

const convertToEST = (date) => {
    return moment(date).tz("America/New_York").format("YYYY-MM-DDTHH:mm");
}


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
                    <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <meta name="x-apple-disable-message-reformatting" />
                      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                      <title></title>
                      <style type="text/css" rel="stylesheet" media="all">
                        @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
                    
                        body {
                          width: 100% !important;
                          height: 100%;
                          margin: 0;
                          -webkit-text-size-adjust: none;
                        }
                    
                        a {
                          color: #3869D4;
                        }
                    
                        a img {
                          border: none;
                        }
                    
                        td {
                          word-break: break-word;
                        }
                    
                        .preheader {
                          display: none !important;
                          visibility: hidden;
                          mso-hide: all;
                          font-size: 1px;
                          line-height: 1px;
                          max-height: 0;
                          max-width: 0;
                          opacity: 0;
                          overflow: hidden;
                        }
                    
                        body,
                        td,
                        th {
                          font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
                        }
                    
                        h1 {
                          margin-top: 0;
                          color: #333333;
                          font-size: 22px;
                          font-weight: bold;
                          text-align: left;
                        }
                    
                        h2 {
                          margin-top: 0;
                          color: #333333;
                          font-size: 16px;
                          font-weight: bold;
                          text-align: left;
                        }
                    
                        h3 {
                          margin-top: 0;
                          color: #333333;
                          font-size: 14px;
                          font-weight: bold;
                          text-align: left;
                        }
                    
                        td,
                        th {
                          font-size: 16px;
                        }
                    
                        p,
                        ul,
                        ol,
                        blockquote {
                          margin: .4em 0 1.1875em;
                          font-size: 16px;
                          line-height: 1.625;
                        }
                    
                        p.sub {
                          font-size: 13px;
                        }
                    
                        .align-right {
                          text-align: right;
                        }
                    
                        .align-left {
                          text-align: left;
                        }
                    
                        .align-center {
                          text-align: center;
                        }
                    
                        .button {
                          background-color: #3869D4;
                          border-top: 10px solid #3869D4;
                          border-right: 18px solid #3869D4;
                          border-bottom: 10px solid #3869D4;
                          border-left: 18px solid #3869D4;
                          display: inline-block;
                          color: #FFF;
                          text-decoration: none;
                          border-radius: 3px;
                          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
                          -webkit-text-size-adjust: none;
                          box-sizing: border-box;
                        }
                    
                        .button--green {
                          background-color: #22BC66;
                          border-top: 10px solid #22BC66;
                          border-right: 18px solid #22BC66;
                          border-bottom: 10px solid #22BC66;
                          border-left: 18px solid #22BC66;
                        }
                    
                        .button--red {
                          background-color: #FF6136;
                          border-top: 10px solid #FF6136;
                          border-right: 18px solid #FF6136;
                          border-bottom: 10px solid #FF6136;
                          border-left: 18px solid #FF6136;
                        }
                    
                        @media only screen and (max-width: 500px) {
                          .button {
                            width: 100% !important;
                            text-align: center !important;
                          }
                        }
                    
                        .attributes {
                          margin: 0 0 21px;
                        }
                    
                        .attributes_content {
                          background-color: #F4F4F7;
                          padding: 16px;
                        }
                    
                        .attributes_item {
                          padding: 0;
                        }
                    
                        .related {
                          width: 100%;
                          margin: 0;
                          padding: 25px 0 0 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .related_item {
                          padding: 10px 0;
                          color: #CBCCCF;
                          font-size: 15px;
                          line-height: 18px;
                        }
                    
                        .related_item-title {
                          display: block;
                          margin: .5em 0 0;
                        }
                    
                        .related_item-thumb {
                          display: block;
                          padding-bottom: 10px;
                        }
                    
                        .related_heading {
                          border-top: 1px solid #CBCCCF;
                          text-align: center;
                          padding: 25px 0 10px;
                        }
                    
                        .discount {
                          width: 100%;
                          margin: 0;
                          padding: 24px;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          background-color: #F4F4F7;
                          border: 2px dashed #CBCCCF;
                        }
                    
                        .discount_heading {
                          text-align: center;
                        }
                    
                        .discount_body {
                          text-align: center;
                          font-size: 15px;
                        }
                    
                        .social {
                          width: auto;
                        }
                    
                        .social td {
                          padding: 0;
                          width: auto;
                        }
                    
                        .social_icon {
                          height: 20px;
                          margin: 0 8px 10px 8px;
                          padding: 0;
                        }
                    
                        .purchase {
                          width: 100%;
                          margin: 0;
                          padding: 35px 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .purchase_content {
                          width: 100%;
                          margin: 0;
                          padding: 25px 0 0 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .purchase_item {
                          padding: 10px 0;
                          color: #51545E;
                          font-size: 15px;
                          line-height: 18px;
                        }
                    
                        .purchase_heading {
                          padding-bottom: 8px;
                          border-bottom: 1px solid #EAEAEC;
                        }
                    
                        .purchase_heading p {
                          margin: 0;
                          color: #85878E;
                          font-size: 12px;
                        }
                    
                        .purchase_footer {
                          padding-top: 15px;
                          border-top: 1px solid #EAEAEC;
                        }
                    
                        .purchase_total {
                          margin: 0;
                          text-align: right;
                          font-weight: bold;
                          color: #333333;
                        }
                    
                        .purchase_total--label {
                          padding: 0 15px 0 0;
                        }
                    
                        body {
                          background-color: #F2F4F6;
                          color: #51545E;
                        }
                    
                        p {
                          color: #51545E;
                        }
                    
                        .email-wrapper {
                          width: 100%;
                          margin: 0;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          background-color: #F2F4F6;
                        }
                    
                        .email-content {
                          width: 100%;
                          margin: 0;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .email-masthead {
                          padding: 25px 0;
                          text-align: center;
                        }
                    
                        .email-masthead_logo {
                          width: 94px;
                        }
                    
                        .email-masthead_name {
                          font-size: 16px;
                          font-weight: bold;
                          color: #A8AAAF;
                          text-decoration: none;
                          text-shadow: 0 1px 0 white;
                        }
                    
                        .email-body {
                          width: 100%;
                          margin: 0;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .email-body_inner {
                          width: 570px;
                          margin: 0 auto;
                          padding: 0;
                          -premailer-width: 570px;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          background-color: #FFFFFF;
                        }
                    
                        .email-footer {
                          width: 570px;
                          margin: 0 auto;
                          padding: 0;
                          -premailer-width: 570px;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          text-align: center;
                        }
                    
                        .email-footer p {
                          color: #A8AAAF;
                        }
                    
                        .body-action {
                          width: 100%;
                          margin: 30px auto;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          text-align: center;
                        }
                    
                        .top-logo {
                          /* width: 20%;*/
                        }
                    
                        .body-sub {
                          margin-top: 25px;
                          padding-top: 25px;
                          border-top: 1px solid #EAEAEC;
                        }
                    
                        .content-cell {
                          padding: 45px;
                        }
                    
                        @media only screen and (max-width: 600px) {
                    
                          .email-body_inner,
                          .email-footer {
                            width: 100% !important;
                          }
                        }
                    
                        @media (prefers-color-scheme: dark) {
                    
                          body,
                          .email-body,
                          .email-body_inner,
                          .email-content,
                          .email-wrapper,
                          .email-masthead,
                          .email-footer {
                            background-color: #333333 !important;
                            color: #FFF !important;
                          }
                    
                          p,
                          ul,
                          ol,
                          blockquote,
                          h1,
                          h2,
                          h3 {
                            color: #FFF !important;
                          }
                    
                          .attributes_content,
                          .discount {
                            background-color: #222 !important;
                          }
                    
                          .email-masthead_name {
                            text-shadow: none !important;
                          }
                        }
                      </style>
                    </head>
                    
                    <body>
                      <span class="preheader">Going live October 14, Elastic's Financial Analyst Meeting</span>
                      <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td align="center">
                            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td class="email-masthead">
                                  <a href="https://MyVirtualGradParty.com" class="f-fallback email-masthead_name">
                                  </a>
                                  <div class="top-logo" style="text-align: center;">
                                    <a href="https://interverify.co/" class="f-fallback email-masthead_name" style="text-align: center;">
                                      <img src="https://interverify.co/images/weblogo.png" alt="Elasticam2020"
                                        style="width: 50px;position: relative;top: 7px;">
                                      <span style="font-size: 50px; margin-left: 10px;">interverify</span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                                  <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0"
                                    role="presentation">
                                    <tr>
                                      <td class="content-cell">
                                        <div class="f-fallback">
                                          <p>Hi ${userInfo.candidate_name_first}, </p>
                                          <p>You are confirmed for a video interview on  ${convertToEST(userInfo.date_of_interview)} EST. </p>
                                          <p> You are required to verify your identity before proceeding to the interview. The process
                                            should be quick and
                                            seamless. Please begin the verification process not more than 5 minutes prior to your interview.
                                            When you are ready to begin the verification process, please click the link below.</p>
                                          <a href="${verifyURL}">${verifyURL}</a>
                                          <p>Things to Note </p>
                                          <p>• Please have a valid government issued form of identification for this process.</p>
                                          <p>• Make sure you are in a well lit room.</p>
                                          <p>• Using a smartphone for the ID verification process will be ideal.</p>
                                          <p>• If you have any difficulties in the verification process, please email <a href="mailto:support@interverify.co">support@interverify.co</a>
                                            with the subject “Urgent” and make sure to include your full name.</p>
                                          <p>Good luck!</p>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0"
                                    role="presentation">
                                    <tr>
                                      <td class="content-cell" align="center">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </body>
                    </html>
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
                    <html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title></title>
  <style type="text/css" rel="stylesheet" media="all">
    @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      -webkit-text-size-adjust: none;
    }

    a {
      color: #3869D4;
    }

    a img {
      border: none;
    }

    td {
      word-break: break-word;
    }

    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }

    body,
    td,
    th {
      font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
    }

    h1 {
      margin-top: 0;
      color: #333333;
      font-size: 22px;
      font-weight: bold;
      text-align: left;
    }

    h2 {
      margin-top: 0;
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }

    h3 {
      margin-top: 0;
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      text-align: left;
    }

    td,
    th {
      font-size: 16px;
    }

    p,
    ul,
    ol,
    blockquote {
      margin: .4em 0 1.1875em;
      font-size: 16px;
      line-height: 1.625;
    }

    p.sub {
      font-size: 13px;
    }

    .align-right {
      text-align: right;
    }

    .align-left {
      text-align: left;
    }

    .align-center {
      text-align: center;
    }

    .button {
      background-color: #3869D4;
      border-top: 10px solid #3869D4;
      border-right: 18px solid #3869D4;
      border-bottom: 10px solid #3869D4;
      border-left: 18px solid #3869D4;
      display: inline-block;
      color: #FFF;
      text-decoration: none;
      border-radius: 3px;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
      -webkit-text-size-adjust: none;
      box-sizing: border-box;
    }

    .button--green {
      background-color: #22BC66;
      border-top: 10px solid #22BC66;
      border-right: 18px solid #22BC66;
      border-bottom: 10px solid #22BC66;
      border-left: 18px solid #22BC66;
    }

    .button--red {
      background-color: #FF6136;
      border-top: 10px solid #FF6136;
      border-right: 18px solid #FF6136;
      border-bottom: 10px solid #FF6136;
      border-left: 18px solid #FF6136;
    }

    @media only screen and (max-width: 500px) {
      .button {
        width: 100% !important;
        text-align: center !important;
      }
    }

    .attributes {
      margin: 0 0 21px;
    }

    .attributes_content {
      background-color: #F4F4F7;
      padding: 16px;
    }

    .attributes_item {
      padding: 0;
    }

    .related {
      width: 100%;
      margin: 0;
      padding: 25px 0 0 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }

    .related_item {
      padding: 10px 0;
      color: #CBCCCF;
      font-size: 15px;
      line-height: 18px;
    }

    .related_item-title {
      display: block;
      margin: .5em 0 0;
    }

    .related_item-thumb {
      display: block;
      padding-bottom: 10px;
    }

    .related_heading {
      border-top: 1px solid #CBCCCF;
      text-align: center;
      padding: 25px 0 10px;
    }

    .discount {
      width: 100%;
      margin: 0;
      padding: 24px;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #F4F4F7;
      border: 2px dashed #CBCCCF;
    }

    .discount_heading {
      text-align: center;
    }

    .discount_body {
      text-align: center;
      font-size: 15px;
    }

    .social {
      width: auto;
    }

    .social td {
      padding: 0;
      width: auto;
    }

    .social_icon {
      height: 20px;
      margin: 0 8px 10px 8px;
      padding: 0;
    }

    .purchase {
      width: 100%;
      margin: 0;
      padding: 35px 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }

    .purchase_content {
      width: 100%;
      margin: 0;
      padding: 25px 0 0 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }

    .purchase_item {
      padding: 10px 0;
      color: #51545E;
      font-size: 15px;
      line-height: 18px;
    }

    .purchase_heading {
      padding-bottom: 8px;
      border-bottom: 1px solid #EAEAEC;
    }

    .purchase_heading p {
      margin: 0;
      color: #85878E;
      font-size: 12px;
    }

    .purchase_footer {
      padding-top: 15px;
      border-top: 1px solid #EAEAEC;
    }

    .purchase_total {
      margin: 0;
      text-align: right;
      font-weight: bold;
      color: #333333;
    }

    .purchase_total--label {
      padding: 0 15px 0 0;
    }

    body {
      background-color: #F2F4F6;
      color: #51545E;
    }

    p {
      color: #51545E;
    }

    .email-wrapper {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #F2F4F6;
    }

    .email-content {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }

    .email-masthead {
      padding: 25px 0;
      text-align: center;
    }

    .email-masthead_logo {
      width: 94px;
    }

    .email-masthead_name {
      font-size: 16px;
      font-weight: bold;
      color: #A8AAAF;
      text-decoration: none;
      text-shadow: 0 1px 0 white;
    }

    .email-body {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }

    .email-body_inner {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      -premailer-width: 570px;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #FFFFFF;
    }

    .email-footer {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      -premailer-width: 570px;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      text-align: center;
    }

    .email-footer p {
      color: #A8AAAF;
    }

    .body-action {
      width: 100%;
      margin: 30px auto;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      text-align: center;
    }

    .top-logo {
      /* width: 20%;*/
    }

    .body-sub {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #EAEAEC;
    }

    .content-cell {
      padding: 45px;
    }

    @media only screen and (max-width: 600px) {

      .email-body_inner,
      .email-footer {
        width: 100% !important;
      }
    }

    @media (prefers-color-scheme: dark) {

      body,
      .email-body,
      .email-body_inner,
      .email-content,
      .email-wrapper,
      .email-masthead,
      .email-footer {
        background-color: #333333 !important;
        color: #FFF !important;
      }

      p,
      ul,
      ol,
      blockquote,
      h1,
      h2,
      h3 {
        color: #FFF !important;
      }

      .attributes_content,
      .discount {
        background-color: #222 !important;
      }

      .email-masthead_name {
        text-shadow: none !important;
      }
    }
  </style>
</head>

<body>
  <span class="preheader">Going live October 14, Elastic's Financial Analyst Meeting</span>
  <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td class="email-masthead">
              <a href="https://MyVirtualGradParty.com" class="f-fallback email-masthead_name">
              </a>
              <div class="top-logo" style="text-align: center;">
                <a href="https://interverify.co/" class="f-fallback email-masthead_name" style="text-align: center;">
                  <img src="https://interverify.co/images/weblogo.png" alt="Elasticam2020"
                    style="width: 50px;position: relative;top: 7px;">
                  <span style="font-size: 50px; margin-left: 10px;">interverify</span>
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td class="email-body" width="570" cellpadding="0" cellspacing="0">
              <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0"
                role="presentation">
                <tr>
                  <td class="content-cell">
                    <div class="f-fallback">
                      <p>Hi ${userInfo.interviewer_name_first}, </p>
                      <p>Your Interview candidate has successfully verified their Identity using InterVerify.</p>
                      <p>Interview Date: ${convertToEST(userInfo.date_of_interview)} EST.</p>
                      <p>Candidate Name: ${(userInfo.name_match && userInfo.name_match === 'match') ? 'Match' : 'Not Match'}</p>
                      <p>Candidate ID: ${(userInfo.id_verification_result && userInfo.id_verification_result ===
                            'verified') ? 'Verified' : 'Not Verified'}</p>
                      <p>Candidate Photo: <a href="${config.aws_s3_endpoint}${userInfo.verify_photo}"
                          target="_blank">Click here</a></p>
                      <p>You may now begin interview process by clicking the link below.</p>
                      <p><a href="${userInfo.social_link}">${userInfo.social_link}</a></p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0"
                role="presentation">
                <tr>
                  <td class="content-cell" align="center">
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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

controller.sendResultMailToRecruiter = (req, res, next) => {
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
                    to: userInfo.recruiter_email,
                    subject: 'Interverify Support Team',
                    html: `
                    <html>

                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <meta name="x-apple-disable-message-reformatting" />
                      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                      <title></title>
                      <style type="text/css" rel="stylesheet" media="all">
                        @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
                        body {
                          width: 100% !important;
                          height: 100%;
                          margin: 0;
                          -webkit-text-size-adjust: none;
                        }
                    
                        a {
                          color: #3869D4;
                        }
                    
                        a img {
                          border: none;
                        }
                    
                        td {
                          word-break: break-word;
                        }
                    
                        .preheader {
                          display: none !important;
                          visibility: hidden;
                          mso-hide: all;
                          font-size: 1px;
                          line-height: 1px;
                          max-height: 0;
                          max-width: 0;
                          opacity: 0;
                          overflow: hidden;
                        }
                    
                        body,
                        td,
                        th {
                          font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
                        }
                    
                        h1 {
                          margin-top: 0;
                          color: #333333;
                          font-size: 22px;
                          font-weight: bold;
                          text-align: left;
                        }
                    
                        h2 {
                          margin-top: 0;
                          color: #333333;
                          font-size: 16px;
                          font-weight: bold;
                          text-align: left;
                        }
                    
                        h3 {
                          margin-top: 0;
                          color: #333333;
                          font-size: 14px;
                          font-weight: bold;
                          text-align: left;
                        }
                    
                        td,
                        th {
                          font-size: 16px;
                        }
                    
                        p,
                        ul,
                        ol,
                        blockquote {
                          margin: .4em 0 1.1875em;
                          font-size: 16px;
                          line-height: 1.625;
                        }
                    
                        p.sub {
                          font-size: 13px;
                        }
                    
                        .align-right {
                          text-align: right;
                        }
                    
                        .align-left {
                          text-align: left;
                        }
                    
                        .align-center {
                          text-align: center;
                        }
                    
                        .button {
                          background-color: #3869D4;
                          border-top: 10px solid #3869D4;
                          border-right: 18px solid #3869D4;
                          border-bottom: 10px solid #3869D4;
                          border-left: 18px solid #3869D4;
                          display: inline-block;
                          color: #FFF;
                          text-decoration: none;
                          border-radius: 3px;
                          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
                          -webkit-text-size-adjust: none;
                          box-sizing: border-box;
                        }
                    
                        .button--green {
                          background-color: #22BC66;
                          border-top: 10px solid #22BC66;
                          border-right: 18px solid #22BC66;
                          border-bottom: 10px solid #22BC66;
                          border-left: 18px solid #22BC66;
                        }
                    
                        .button--red {
                          background-color: #FF6136;
                          border-top: 10px solid #FF6136;
                          border-right: 18px solid #FF6136;
                          border-bottom: 10px solid #FF6136;
                          border-left: 18px solid #FF6136;
                        }
                    
                        @media only screen and (max-width: 500px) {
                          .button {
                            width: 100% !important;
                            text-align: center !important;
                          }
                        }
                    
                        .attributes {
                          margin: 0 0 21px;
                        }
                    
                        .attributes_content {
                          background-color: #F4F4F7;
                          padding: 16px;
                        }
                    
                        .attributes_item {
                          padding: 0;
                        }
                    
                        .related {
                          width: 100%;
                          margin: 0;
                          padding: 25px 0 0 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .related_item {
                          padding: 10px 0;
                          color: #CBCCCF;
                          font-size: 15px;
                          line-height: 18px;
                        }
                    
                        .related_item-title {
                          display: block;
                          margin: .5em 0 0;
                        }
                    
                        .related_item-thumb {
                          display: block;
                          padding-bottom: 10px;
                        }
                    
                        .related_heading {
                          border-top: 1px solid #CBCCCF;
                          text-align: center;
                          padding: 25px 0 10px;
                        }
                    
                        .discount {
                          width: 100%;
                          margin: 0;
                          padding: 24px;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          background-color: #F4F4F7;
                          border: 2px dashed #CBCCCF;
                        }
                    
                        .discount_heading {
                          text-align: center;
                        }
                    
                        .discount_body {
                          text-align: center;
                          font-size: 15px;
                        }
                    
                        .social {
                          width: auto;
                        }
                    
                        .social td {
                          padding: 0;
                          width: auto;
                        }
                    
                        .social_icon {
                          height: 20px;
                          margin: 0 8px 10px 8px;
                          padding: 0;
                        }
                    
                        .purchase {
                          width: 100%;
                          margin: 0;
                          padding: 35px 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .purchase_content {
                          width: 100%;
                          margin: 0;
                          padding: 25px 0 0 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .purchase_item {
                          padding: 10px 0;
                          color: #51545E;
                          font-size: 15px;
                          line-height: 18px;
                        }
                    
                        .purchase_heading {
                          padding-bottom: 8px;
                          border-bottom: 1px solid #EAEAEC;
                        }
                    
                        .purchase_heading p {
                          margin: 0;
                          color: #85878E;
                          font-size: 12px;
                        }
                    
                        .purchase_footer {
                          padding-top: 15px;
                          border-top: 1px solid #EAEAEC;
                        }
                    
                        .purchase_total {
                          margin: 0;
                          text-align: right;
                          font-weight: bold;
                          color: #333333;
                        }
                    
                        .purchase_total--label {
                          padding: 0 15px 0 0;
                        }
                    
                        body {
                          background-color: #F2F4F6;
                          color: #51545E;
                        }
                    
                        p {
                          color: #51545E;
                        }
                    
                        .email-wrapper {
                          width: 100%;
                          margin: 0;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          background-color: #F2F4F6;
                        }
                    
                        .email-content {
                          width: 100%;
                          margin: 0;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .email-masthead {
                          padding: 25px 0;
                          text-align: center;
                        }
                    
                        .email-masthead_logo {
                          width: 94px;
                        }
                    
                        .email-masthead_name {
                          font-size: 16px;
                          font-weight: bold;
                          color: #A8AAAF;
                          text-decoration: none;
                          text-shadow: 0 1px 0 white;
                        }
                    
                        .email-body {
                          width: 100%;
                          margin: 0;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .email-body_inner {
                          width: 570px;
                          margin: 0 auto;
                          padding: 0;
                          -premailer-width: 570px;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          background-color: #FFFFFF;
                        }
                    
                        .email-footer {
                          width: 570px;
                          margin: 0 auto;
                          padding: 0;
                          -premailer-width: 570px;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          text-align: center;
                        }
                    
                        .email-footer p {
                          color: #A8AAAF;
                        }
                    
                        .body-action {
                          width: 100%;
                          margin: 30px auto;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          text-align: center;
                        }
                    
                        .top-logo {
                          /* width: 20%;*/
                        }
                    
                        .body-sub {
                          margin-top: 25px;
                          padding-top: 25px;
                          border-top: 1px solid #EAEAEC;
                        }
                    
                        .content-cell {
                          padding: 45px;
                        }
                    
                        @media only screen and (max-width: 600px) {
                    
                          .email-body_inner,
                          .email-footer {
                            width: 100% !important;
                          }
                        }
                    
                        @media (prefers-color-scheme: dark) {
                    
                          body,
                          .email-body,
                          .email-body_inner,
                          .email-content,
                          .email-wrapper,
                          .email-masthead,
                          .email-footer {
                            background-color: #333333 !important;
                            color: #FFF !important;
                          }
                    
                          p,
                          ul,
                          ol,
                          blockquote,
                          h1,
                          h2,
                          h3 {
                            color: #FFF !important;
                          }
                    
                          .attributes_content,
                          .discount {
                            background-color: #222 !important;
                          }
                    
                          .email-masthead_name {
                            text-shadow: none !important;
                          }
                        }
                      </style>
                    </head>
                    
                    <body>
                      <span class="preheader">Going live October 14, Elastic's Financial Analyst Meeting</span>
                      <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td align="center">
                            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td class="email-masthead">
                                  <a href="https://MyVirtualGradParty.com" class="f-fallback email-masthead_name">
                                  </a>
                                  <div class="top-logo" style="text-align: center;">
                                    <a href="https://interverify.co/" class="f-fallback email-masthead_name" style="text-align: center;">
                                      <img src="https://interverify.co/images/weblogo.png" alt="Elasticam2020"
                                        style="width: 50px;position: relative;top: 7px;">
                                      <span style="font-size: 50px; margin-left: 10px;">interverify</span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                                  <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0"
                                    role="presentation">
                                    <tr>
                                      <td class="content-cell">
                                        <div class="f-fallback">
                                          <p>Hi ${userInfo.recruiter_first_name}, </p>
                                          <p>Your Interview candidate has successfully verified their Identity using InterVerify.</p>
                                            <p>Interview Date: ${convertToEST(userInfo.date_of_interview)} EST.</p>
                                            <p>Candidate Name: ${(userInfo.name_match && userInfo.name_match === 'match') ? 'Match' : 'Not Match'}</p>
                                            <p>Candidate ID: ${(userInfo.id_verification_result && userInfo.id_verification_result === 'verified') ? 'Verified' : 'Not Verified'}</p>
                                            <p>Candidate Photo: <a href="${config.aws_s3_endpoint}${userInfo.verify_photo}" target="_blank">Click here</a>
                                            <p>You may now begin interview process by clicking the link below.</p>
                                            <p><a href="${userInfo.social_link}">${userInfo.social_link}</a></p>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0"
                                    role="presentation">
                                    <tr>
                                      <td class="content-cell" align="center">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </body>
                    </html>
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
                    <html>

                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <meta name="x-apple-disable-message-reformatting" />
                      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                      <title></title>
                      <style type="text/css" rel="stylesheet" media="all">
                        @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
                        body {
                          width: 100% !important;
                          height: 100%;
                          margin: 0;
                          -webkit-text-size-adjust: none;
                        }
                    
                        a {
                          color: #3869D4;
                        }
                    
                        a img {
                          border: none;
                        }
                    
                        td {
                          word-break: break-word;
                        }
                    
                        .preheader {
                          display: none !important;
                          visibility: hidden;
                          mso-hide: all;
                          font-size: 1px;
                          line-height: 1px;
                          max-height: 0;
                          max-width: 0;
                          opacity: 0;
                          overflow: hidden;
                        }
                    
                        body,
                        td,
                        th {
                          font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
                        }
                    
                        h1 {
                          margin-top: 0;
                          color: #333333;
                          font-size: 22px;
                          font-weight: bold;
                          text-align: left;
                        }
                    
                        h2 {
                          margin-top: 0;
                          color: #333333;
                          font-size: 16px;
                          font-weight: bold;
                          text-align: left;
                        }
                    
                        h3 {
                          margin-top: 0;
                          color: #333333;
                          font-size: 14px;
                          font-weight: bold;
                          text-align: left;
                        }
                    
                        td,
                        th {
                          font-size: 16px;
                        }
                    
                        p,
                        ul,
                        ol,
                        blockquote {
                          margin: .4em 0 1.1875em;
                          font-size: 16px;
                          line-height: 1.625;
                        }
                    
                        p.sub {
                          font-size: 13px;
                        }
                    
                        .align-right {
                          text-align: right;
                        }
                    
                        .align-left {
                          text-align: left;
                        }
                    
                        .align-center {
                          text-align: center;
                        }
                    
                        .button {
                          background-color: #3869D4;
                          border-top: 10px solid #3869D4;
                          border-right: 18px solid #3869D4;
                          border-bottom: 10px solid #3869D4;
                          border-left: 18px solid #3869D4;
                          display: inline-block;
                          color: #FFF;
                          text-decoration: none;
                          border-radius: 3px;
                          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
                          -webkit-text-size-adjust: none;
                          box-sizing: border-box;
                        }
                    
                        .button--green {
                          background-color: #22BC66;
                          border-top: 10px solid #22BC66;
                          border-right: 18px solid #22BC66;
                          border-bottom: 10px solid #22BC66;
                          border-left: 18px solid #22BC66;
                        }
                    
                        .button--red {
                          background-color: #FF6136;
                          border-top: 10px solid #FF6136;
                          border-right: 18px solid #FF6136;
                          border-bottom: 10px solid #FF6136;
                          border-left: 18px solid #FF6136;
                        }
                    
                        @media only screen and (max-width: 500px) {
                          .button {
                            width: 100% !important;
                            text-align: center !important;
                          }
                        }
                    
                        .attributes {
                          margin: 0 0 21px;
                        }
                    
                        .attributes_content {
                          background-color: #F4F4F7;
                          padding: 16px;
                        }
                    
                        .attributes_item {
                          padding: 0;
                        }
                    
                        .related {
                          width: 100%;
                          margin: 0;
                          padding: 25px 0 0 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .related_item {
                          padding: 10px 0;
                          color: #CBCCCF;
                          font-size: 15px;
                          line-height: 18px;
                        }
                    
                        .related_item-title {
                          display: block;
                          margin: .5em 0 0;
                        }
                    
                        .related_item-thumb {
                          display: block;
                          padding-bottom: 10px;
                        }
                    
                        .related_heading {
                          border-top: 1px solid #CBCCCF;
                          text-align: center;
                          padding: 25px 0 10px;
                        }
                    
                        .discount {
                          width: 100%;
                          margin: 0;
                          padding: 24px;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          background-color: #F4F4F7;
                          border: 2px dashed #CBCCCF;
                        }
                    
                        .discount_heading {
                          text-align: center;
                        }
                    
                        .discount_body {
                          text-align: center;
                          font-size: 15px;
                        }
                    
                        .social {
                          width: auto;
                        }
                    
                        .social td {
                          padding: 0;
                          width: auto;
                        }
                    
                        .social_icon {
                          height: 20px;
                          margin: 0 8px 10px 8px;
                          padding: 0;
                        }
                    
                        .purchase {
                          width: 100%;
                          margin: 0;
                          padding: 35px 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .purchase_content {
                          width: 100%;
                          margin: 0;
                          padding: 25px 0 0 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .purchase_item {
                          padding: 10px 0;
                          color: #51545E;
                          font-size: 15px;
                          line-height: 18px;
                        }
                    
                        .purchase_heading {
                          padding-bottom: 8px;
                          border-bottom: 1px solid #EAEAEC;
                        }
                    
                        .purchase_heading p {
                          margin: 0;
                          color: #85878E;
                          font-size: 12px;
                        }
                    
                        .purchase_footer {
                          padding-top: 15px;
                          border-top: 1px solid #EAEAEC;
                        }
                    
                        .purchase_total {
                          margin: 0;
                          text-align: right;
                          font-weight: bold;
                          color: #333333;
                        }
                    
                        .purchase_total--label {
                          padding: 0 15px 0 0;
                        }
                    
                        body {
                          background-color: #F2F4F6;
                          color: #51545E;
                        }
                    
                        p {
                          color: #51545E;
                        }
                    
                        .email-wrapper {
                          width: 100%;
                          margin: 0;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          background-color: #F2F4F6;
                        }
                    
                        .email-content {
                          width: 100%;
                          margin: 0;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .email-masthead {
                          padding: 25px 0;
                          text-align: center;
                        }
                    
                        .email-masthead_logo {
                          width: 94px;
                        }
                    
                        .email-masthead_name {
                          font-size: 16px;
                          font-weight: bold;
                          color: #A8AAAF;
                          text-decoration: none;
                          text-shadow: 0 1px 0 white;
                        }
                    
                        .email-body {
                          width: 100%;
                          margin: 0;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                        }
                    
                        .email-body_inner {
                          width: 570px;
                          margin: 0 auto;
                          padding: 0;
                          -premailer-width: 570px;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          background-color: #FFFFFF;
                        }
                    
                        .email-footer {
                          width: 570px;
                          margin: 0 auto;
                          padding: 0;
                          -premailer-width: 570px;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          text-align: center;
                        }
                    
                        .email-footer p {
                          color: #A8AAAF;
                        }
                    
                        .body-action {
                          width: 100%;
                          margin: 30px auto;
                          padding: 0;
                          -premailer-width: 100%;
                          -premailer-cellpadding: 0;
                          -premailer-cellspacing: 0;
                          text-align: center;
                        }
                    
                        .top-logo {
                          /* width: 20%;*/
                        }
                    
                        .body-sub {
                          margin-top: 25px;
                          padding-top: 25px;
                          border-top: 1px solid #EAEAEC;
                        }
                    
                        .content-cell {
                          padding: 45px;
                        }
                    
                        @media only screen and (max-width: 600px) {
                    
                          .email-body_inner,
                          .email-footer {
                            width: 100% !important;
                          }
                        }
                    
                        @media (prefers-color-scheme: dark) {
                    
                          body,
                          .email-body,
                          .email-body_inner,
                          .email-content,
                          .email-wrapper,
                          .email-masthead,
                          .email-footer {
                            background-color: #333333 !important;
                            color: #FFF !important;
                          }
                    
                          p,
                          ul,
                          ol,
                          blockquote,
                          h1,
                          h2,
                          h3 {
                            color: #FFF !important;
                          }
                    
                          .attributes_content,
                          .discount {
                            background-color: #222 !important;
                          }
                    
                          .email-masthead_name {
                            text-shadow: none !important;
                          }
                        }
                      </style>
                    </head>
                    
                    <body>
                      <span class="preheader">Going live October 14, Elastic's Financial Analyst Meeting</span>
                      <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td align="center">
                            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td class="email-masthead">
                                  <a href="https://MyVirtualGradParty.com" class="f-fallback email-masthead_name">
                                  </a>
                                  <div class="top-logo" style="text-align: center;">
                                    <a href="https://interverify.co/" class="f-fallback email-masthead_name" style="text-align: center;">
                                      <img src="https://interverify.co/images/weblogo.png" alt="Elasticam2020"
                                        style="width: 50px;position: relative;top: 7px;">
                                      <span style="font-size: 50px; margin-left: 10px;">interverify</span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                                  <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0"
                                    role="presentation">
                                    <tr>
                                      <td class="content-cell">
                                        <div class="f-fallback">
                                          <p>Hi ${userInfo.recruiter_first_name}, </p>
                                          <p>You have submitted an Interverify request for ${userInfo.candidate_name_first} ${userInfo.candidate_name_last} for interview on ${convertToEST(userInfo.date_of_interview)} EST.</p>
                                          <p>Candidate will begin verification not more than 5 minutes before the Interview. Once verification is complete, you will be notified with the results.</p> 
                                          <p>If you need to make changes to this submission, please email <a href="mailto:support@interverify.co">support@interverify.co</a> with the changes. Please include candidate name in the email.</p>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0"
                                    role="presentation">
                                    <tr>
                                      <td class="content-cell" align="center">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </body>
                    </html>
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

