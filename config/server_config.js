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
            pass: 'GoodDay)(*1',
        }
    },
    aws_remote_config: {
        accessKeyId: 'AKIAVJKPVCLEKM2YG33J',
        secretAccessKey: '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',
        region: 'us-east-2'
    },
    jwtSecretKey: "jfvt14FcqvsA3ToJMl9lrE"
}