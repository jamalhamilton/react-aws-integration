const config = require('./config/server_config');
const AWS = require('aws-sdk');
AWS.config.update(config.aws_remote_config);
const docClient = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

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
    const params = {
        TableName: 'users',
        FilterExpression: "#cg = :data",
        ExpressionAttributeNames: {
            "#cg": "candidate_email",
        },
        ExpressionAttributeValues: {
            ":data": userData.candidate_email,
        }
    };
    getUserInfo(params)
        .then(data => {
            if (data && data.id && data.token) {
                const id = data.id;
                const token = data.token;
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
                            data: 'Updated',
                            ...params.Item
                        });
                    }
                });
            } else {
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
            }
        })
        .catch(err => {
            res.send({
                success: false,
                message: err
            });
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
                const id = data.id;
                const token = data.token;
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
                            data: 'Updated',
                            ...params.Item
                        });
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
}

module.exports = {
    getUser,
    registerUser,
    updateUserInfo,
    getUserInfo
}