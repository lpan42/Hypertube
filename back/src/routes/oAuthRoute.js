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
    res.redirect("http://localhost:3000/oAuthValid/" + token);
});

router.get('/google', passport.authenticate('google'));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login'
}),(req,res) => {
    req.session.user = req.user;
    const token = req.user.generateToken();
    res.redirect("http://localhost:3000/oAuthValid/" + token);
});

module.exports = router;