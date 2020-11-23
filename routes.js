const router = require('express').Router();
const bodyParser = require('body-parser')

const controller = require('./controller');

const userController = require('./user.controller');
const adminController = require('./admin.controller');

router.get('/', controller.getTest);
router.post('/getUser', bodyParser.json(), userController.getUser);
router.post('/registerUser', bodyParser.json(), userController.registerUser);
router.post('/updateUserInfo', bodyParser.json(), userController.updateUserInfo);
router.post('/sendMail', bodyParser.json(), controller.sendMail);
router.post('/sendResultMail', bodyParser.json(), controller.sendResultMail);
router.post('/sendRegisterSuccessMailToRecruiter', bodyParser.json(), controller.sendRegisterSuccessMailToRecruiter);
router.post('/vouchedVerification', bodyParser.json(), userController.vouchedVerification);

// admin routes
router.post('/admin/login', bodyParser.json(), adminController.login);
router.get('/admin/getAllUsers', adminController.getAllUsers);
router.post('/admin/deleteUser', bodyParser.json(), adminController.deleteUser);
router.post('/admin/updateUser', bodyParser.json(), adminController.updateUser);

module.exports = router;