const config = require('./config/server_config');
const AWS = require('aws-sdk');
AWS.config.update(config.aws_remote_config);
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const userController = require('./user.controller');

const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwtSecretKey);
        if (decoded && decoded.id) {
            return decoded;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

const deleteUser = (req, res) => {
    const authHeader = req.headers['authorization'];
    try {
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (token) {
                const tokenDecode = validateToken(token);
                if (tokenDecode && tokenDecode.id) {
                    const userData = req.body;
                    if (userData && userData.id && userData.token) {
                        const params = {
                            TableName: "users",
                            Key: {
                                id: userData.id
                            }
                        };
                        docClient.delete(params, (err, data) => {
                            if (err) {
                                res.send({
                                    success: false,
                                    message: "sorry!, having issue on deleting the user."
                                });
                                return;
                            } else {
                                res.send({
                                    success: true,
                                    message: "deleted."
                                });
                            }
                        })
                    } else {
                        throw 'Invalid user details';
                    }
                } else {
                    throw 'Unauthorized access';
                }
            } else {
                throw 'Unauthorized access';
            }
        } else {
            throw 'Unauthorized access';
        }
    }
    catch (error) {
        res.send({
            success: false,
            message: error
        });
        return;
    }
}

const updateUser = (req, res) => {
    const authHeader = req.headers['authorization'];
    try {
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (token) {
                const tokenDecode = validateToken(token);
                if (tokenDecode && tokenDecode.id) {
                    const userData = req.body;
                    if (userData && userData.id && userData.token) {
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
                                }
                            })
                            .catch(err => {
                                res.send({
                                    success: false,
                                    message: err
                                });
                            });
                    } else {
                        throw 'Invalid user details';
                    }
                } else {
                    throw 'Unauthorized access';
                }
            } else {
                throw 'Unauthorized access';
            }
        } else {
            throw 'Unauthorized access';
        }
    }
    catch (error) {
        res.send({
            success: false,
            message: error
        });
        return;
    }
}

const getAllUsers = (req, res) => {
    const authHeader = req.headers['authorization'];
    try {
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (token) {
                const tokenDecode = validateToken(token);
                if (tokenDecode && tokenDecode.id) {
                        const params = {
                            TableName: 'users'
                        };
                        docClient.scan(params, function (err, data) {
                            if (err) {
                                console.log(err);
                                res.send({
                                    success: false,
                                    message: err
                                });
                            } else {
                                const { Items } = data;
                                res.send({
                                    success: true,
                                    data: Items 
                                });
                            }
                        });
                } else {
                    throw 'Unauthorized access';
                }
            } else {
                throw 'Unauthorized access';
            }
        } else {
            throw 'Unauthorized access';
        }
    }
    catch (error) {
        res.send({
            success: false,
            message: error
        });
        return;
    }
}

const login = (req, res) => {
    const loginData = req.body;
    try {
        if (loginData && loginData.userName && loginData.password) {
            const params = {
                TableName: 'administrators',
                FilterExpression: "#cg = :data and #pc = :pcdata",
                ExpressionAttributeNames: {
                    "#cg": "email",
                    "#pc": "password",
                },
                ExpressionAttributeValues: {
                    ":data": loginData.userName,
                    ":pcdata": loginData.password
                }
            };
            docClient.scan(params, (err, data) => {
                if (err) {
                    res.send({
                        success: false,
                        message: err
                    });
                    return;
                } else {
                    const details = (data && data['Items'] && data['Items'][0]) ? data['Items'][0] : undefined;
                    if (details && details.id && details.email) {
                        const token = jwt.sign({ id: details.id, email: details.email, name: details.name }, config.jwtSecretKey);
                        res.send({
                            success: true,
                            token
                        });
                    } else {
                        res.send({
                            success: false,
                            message: 'Invalid access'
                        });
                    }
                }
            });
        } else {
            throw 'Invalid access';
        }
    }
    catch (error) {
        res.send({
            success: false,
            message: error
        });
        return;
    }
}

module.exports = {
    login,
    deleteUser,
    updateUser,
    getAllUsers
}