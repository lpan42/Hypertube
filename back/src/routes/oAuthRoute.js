const express = require('express');
const router = express.Router();
const passport = require("passport");
require('../middleware/passportOAuth');

router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: 'http://localhost:3000/login'
}),(req,res) => {
    req.session.user = req.user;
    const token = req.user.generateToken();
    res.redirect("http://localhost:3000/oAuthValid?token=" + token);
    // return res.status(200).json({
    //     success: 'sucessfully login',
    //     data: req.user,
    //     token: token
    // });
});

module.exports = router;