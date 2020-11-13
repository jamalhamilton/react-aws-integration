const config = require('./config/server_config');
const AWS = require('aws-sdk');
AWS.config.update(config.aws_remote_config);
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');
const Client = require("@vouched.id/vouched-nodejs").default;
const VouchedClient = Client("~!hT~I1GMw!Aoq~zXCWz9x5Z2o6r5x");

const generateRandomString = (len) => {
    if (!len) len = 8;
    var characters = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    var charactersLength = characters.length;
    var randomString = '';
    for (var i = 0; i < len; i++) {
        randomString += characters[parseInt(Math.random() * charactersLength)];
    }
    return randomString;
};

const registerUser = (req, res) => {
    let errMsg = '';
    const userData = req.body;
    if (!userData.candidate_email) errMsg = 'Candidate Email is not provided.';
    if (errMsg) {
        res.send({ status: false, data: errMsg });
        return;
    }
    const token = generateRandomString(20);
    const id = uuidv4();
    const params = {
        TableName: 'users',
        Item: {
            token,
            ...userData,
            id
        }
    };
    docClient.put(params, function (err, data) {
        if (err) {
            res.send({ status: false, data: err });
            return;
        } else {
            res.send({
                status: true,
                data: 'Inserted',
                token,
                id
            });
        }
    });
};


const getUserInfo = (params) => {
    return new Promise((resolve, reject) => {
        docClient.scan(params, function (err, data) {
            if (err) {
                console.log(err)
                return reject(err);
            } else {
                const { Items } = data;
                return resolve(Items[0]);
            }
        });
    });
}

const getUser = (req, res) => {
    let errMsg = '';
    const userData = req.body;
    if (!userData.token) errMsg = 'User Info is not provided.';
    if (errMsg) {
        res.send({ status: false, data: errMsg });
        return;
    }
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
    getUserInfo(params)
        .then(data => {
            res.send({
                status: true,
                data,
                token: data.token
            });
        })
        .catch(err => {
            res.send({
                success: false,
                message: err
            });
        });
};

const vouchedVerification = async (req, res) => {
    const userData = req.body;
    let errMsg;
    if (!userData.verificationToken) errMsg = 'Verification Info is not provided.';
    if (errMsg) {
        res.send({ status: false, data: errMsg });
        return;
    }
    try {
        const jobs = await VouchedClient.jobs({
            page: 1,
            pageSize: 1,
            type: 'id-verification',
            status: 'completed',
            token: userData.verificationToken,
            sortBy: 'submitted',
            sortOrder: 'desc',
            withPhotos: true
        });
        if (jobs && jobs.items && jobs.items.length) {
            let photoToUpdate;
            for (let i = 0; i < jobs.items.length; i++) {
                if (!(jobs.items[i].errors && jobs.items[i].errors.length)) {
                    if (jobs.items[i].request && jobs.items[i].request.parameters && jobs.items[i].request.parameters.idPhoto) {
                        photoToUpdate = jobs.items[i].request.parameters.idPhoto;
                        break;
                    }
                }
            }
            if (photoToUpdate) {
                res.send({
                    status: true,
                    data: photoToUpdate
                });
            } else {
                res.send({ status: false, message: "No ID found!" });
            }
        } else {
            res.send({ status: false, message: "No ID found!" });
            return;
        }
    }
    catch (err) {
        res.send({ status: false, data: err });
        return;
    }
}

const updateUserInfo = (req, res) => {
    let errMsg = '';
    const userData = req.body;
    if (!userData.token) errMsg = 'User Info is not provided.';
    if (errMsg) {
        res.send({ status: false, data: errMsg });
        return;
    }
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
    getUserInfo(params)
        .then(data => {
            if (data && data.id && data.token) {
                const params = {
                    TableName: 'users',
                    Item: {
                        ...data,
                        ...userData
                    }
                };
                docClient.put(params, function (err, data) {
                    if (err) {
                        res.send({ status: false, data: err });
                        return;
                    } else {
                        res.send({
                            status: true,
                            data: 'Updated',
                            ...params.Item
                        });
                    }
                });
            } else {
                res.send({
                    success: false,
                    message: "No record found!"
                });
            }
        })
        .catch(err => {
            res.send({
                success: false,
                message: err
            });
        });
}

module.exports = {
    getUser,
    registerUser,
    updateUserInfo,
    getUserInfo,
    vouchedVerification
}