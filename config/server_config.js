module.exports = {
    serverPort: 5000,
    serverRoot: 'https://interverify.co',
    verifyURL: "/verifyID",
    // db: {
    //     host: 'localhost',
    //     user: 'root',
    //     password: '',
    //     port: 3306,
    //     database: 'db_interverify'
    // },
    smtp: {

        service: 'gmail',
        auth: {
            user: 'donotreply@interverify.co',
            pass: '',
        }
    },
    aws_remote_config: {
        accessKeyId: 'xx',
        secretAccessKey: 'xx',
        region: 'us-east-2'
    },
    jwtSecretKey: "xx",
    aws_s3_endpoint: 'https://idauth.s3.us-east-2.amazonaws.com/'
}