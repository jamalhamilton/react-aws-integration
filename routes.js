const router = require('express').Router();
const bodyParser = require('body-parser')

const controller = require('./controller');

const userController = require('./user.controller');

router.get('/', controller.getTest);
router.post('/getUser', bodyParser.json(), userController.getUser);
router.post('/registerUser', bodyParser.json(), userController.registerUser);
router.post('/updateUserInfo', bodyParser.json(), userController.updateUserInfo);
router.post('/sendMail', bodyParser.json(), controller.sendMail);
router.post('/sendResultMail', bodyParser.json(), controller.sendResultMail);

module.exports = router;