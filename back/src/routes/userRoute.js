const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const passport = require("passport");
//connect 
router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/auth').get(auth, userController.authUser);
// router.route('/resetpwd/:input').get(userController.resetpwd);
// router.route('/verifypwdlink/:resetpwd_link').get(userController.verifyPwdLink);
// router.route('/updatepwd').post(userController.updatepwd);
router.route('/logout').get(auth, userController.logout);

//getInfo
router.route('/account/:userid').get(auth, userController.getAccount);

//modify
router.route('/modify/account').post(auth,userController.modifyAccount);
router.route('/modify/avatar').post(auth,userController.modifyAvatar);

module.exports = router;