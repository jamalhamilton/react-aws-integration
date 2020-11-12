const siteUrl = "https://interverify.co";
//const siteUrl = "http://localhost:3000/";
const redirectUrl = siteUrl + '/idme_code'
const clientId = "xxxx"

export default {
    siteUrl: siteUrl,
    idme: {
        cliendId: clientId,
        clientSecret: "xxx",
        redirectUrl: redirectUrl,
        authEndPoint: "https://api.id.me/oauth/authorize?client_id=" + clientId + "&redirect_uri=" + redirectUrl + "&response_type=token&scope=loa3",
        
    },
    aws: {
        accessKey: "xxx",
        secretKey: "xxxx",
        region: "us-east-2",
        bucket: "idauth"
    },
    api:{
        // get requests
        verifyID: '/verifyID', 
        
        // post requests
        getUser: '/api/getUser',
        registerUser: '/api/registerUser',
        sendMail: '/api/sendMail',
        sendResultMail: '/api/sendResultMail',
        updateUserInfo: '/api/updateUserInfo',
        adminLogin: '/api/admin/login',
        adminGetAllUsers: '/api/admin/getAllUsers',
        adminDeleteUser: '/api/admin/deleteUser',
        adminUpdate: '/api/admin/updateUser',
        getPhotoId: '/api/vouchedVerification'
    },
    vouched_PUBLIC_KEY: 'V~F_e~g0ySKtaos#PX.I9Vo4P*1Kxh'
}