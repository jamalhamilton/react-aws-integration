

module.exports = {
    serverPort: 5000,
    serverRoot: 'https://interverify.co',
    verifyURL: "/verifyID",
    db: {
        host: 'localhost',
        user: 'root',
        password: 'password1231',
        port: 3306,
        database: 'db_interverify'
    },
    smtp: {

        service: 'gmail',
        auth: {
            user: 'donotreply@interverify.co',
            pass: 'GoodDay)(*1',
        }
    },
}