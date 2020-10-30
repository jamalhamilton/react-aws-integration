const router = require('express').Router();
const bodyParser = require('body-parser')

const controller = require('./controller');

router.get('/', controller.getTest);
router.post('/getUser', bodyParser.json(), controller.getUser);
router.post('/registerUser', bodyParser.json(), controller.registerUser);
router.post('/updateUserInfo', bodyParser.json(), controller.updateUserInfo);
router.post('/sendMail', bodyParser.json(), controller.sendMail);
router.post('/sendResultMail', bodyParser.json(), controller.sendResultMail);

module.exports = router;