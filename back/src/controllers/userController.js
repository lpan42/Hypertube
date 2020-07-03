const User = require('../models/user');
const emailSender = require('../models/emailSender');
const crypto = require('crypto');
const sanitize = require('mongo-sanitize');
const passport = require("passport");
require("../middleware/passportAuthLocal");

export async function getAccount(req, res) {
    if(req.params.userid === req.userid){
        try{
            const user = await User.findOne({ _id: req.params.userid })
            if(!user)
                return res.status(400).json({ error: "UserId invalid" });   
            const result = {
                id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                avatar: user.avatar,
                language: user.language,
                watched:user.watched,
                watchLater: user.watchLater,
            };  
            return res.status(200).json({
                data: result
            });
        }catch(err){
            return res.status(400).json({ error: "UserId invalid" });   
        }
    }
    else{
        try{
            const user = await User.findOne({ _id:req.params.userid });
            if(!user)
                return res.status(400).json({ error: "UserId invalid" });   
            const result = {
                id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.avatar,
                language: user.language,
                watched:user.watched,
                watchLater: user.watchLater,
            };
            return res.status(200).json({
                data: result
            });
        }catch(err){
            return res.status(400).json({ error: "UserId invalid" });   
        }
        
    }
}

export async function register(req, res) {
    const check_email = await User.findOne({ email : req.body.email.toLowerCase()});
    if (check_email)
        return res.status(400).json({ error: "Email has been registered" });
    const check_username = await User.findOne({ username : req.body.username.toLowerCase() });
    if (check_username)
        return res.status(400).json({ error: "Username has been registered" });
    const newUser = new User({
        username: sanitize(req.body.username.toLowerCase()),
        firstname: sanitize(req.body.firstname.toLowerCase()),
        lastname: sanitize(req.body.lastname.toLowerCase()),
        email: sanitize(req.body.email.toLowerCase()),
    });
    User.register(newUser, req.body.password, (err) => {
        if (err) 
            return res.status(400).json({ error: err.message });
        return res.status(200).json({ success: "Register success, You may login now" });
    })
}

export async function login(req, res) {
    passport.authenticate("local", (err, user, info) => {
        if (err) 
            { return res.status(400).json({ error: err }); }
        if (!user) 
            { return res.status(400).json({ error: info.message }); }
        req.logIn(user, err => {
            if (err) 
                { return res.status(400).json({ error: err }); }
            const result = {
                id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                avatar: user.avatar,
                language: user.language,
                watched:user.watched,
                watchLater: user.watchLater,
            };
            req.session.user = result;
            const token = user.generateToken();
            return res.status(200).json({
                success: 'sucessfully login',
                data: result,
                token: token
            });
        })
    })(req,res);
}

export async function authUser(req, res){
    await User.findOne({ _id: req.userid},(err,user)=>{
        if (err || !user) {
            return res.status(400).json({ error: "Auth user failed" });
        }
        const result = {
            id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            avatar: user.avatar,
            language: user.language,
            watched:user.watched,
            watchLater: user.watchLater,
        };
        return res.status(200).json({
            data: result,
        });
    });
}

export async function logout(req, res) {
    req.logout();
    req.session = null;
    return res.status(200).json({ success: 'user offline' });
}

export async function modifyAvatar(req,res){
    const filename = req.userid + crypto.randomBytes(5).toString('hex');
    const file = req.files.file;
    if(file){
        file.mv(`../front/public/images/${filename}`, err => {
            if(err){
                return res.status(500).send(err);
            }
        });
        const result = await User.updateOne({_id:req.userid},{
            $set:{ avatar: "http://localhost:3000/images/"+filename }
        })
        if (result.ok !== 1)
            return res.status(400).json({ error:"Update failed" });
        return res.status(200);
    }
    else{
        return res.status(400).json({ error:"Update failed" });
    }
}

export async function modifyAccount(req,res){
    if(req.userid !== req.body.id){
        return res.status(400).json({ error: "This is not your account."});
    }
    if(req.body.email){
        const check_email = await User.findOne({email : req.body.email.toLowerCase(), _id: {$ne: req.userid}});
        if (check_email)
            return res.status(400).json({ error: "Email has been registered" });
    }
    const check_username = await User.findOne({ username : req.body.username.toLowerCase(), _id: {$ne: req.userid}});
    if (check_username)
        return res.status(400).json({ error: "Username has been registered" });
    let data = {
        username:sanitize(req.body.username.toLowerCase()),
        email: req.body.email ? sanitize(req.body.email.toLowerCase()): null,
        firstname: sanitize(req.body.firstname.toLowerCase()),
        lastname: sanitize(req.body.lastname.toLowerCase()),
        language: sanitize(req.body.language.toLowerCase())
    }
    const result = await User.findOneAndUpdate({_id:req.userid},{$set:data},(err) => {
        if(err) return res.status(400).json({ error:"Update failed" });
    });
    req.session.user = result;
    return res.status(200).json({ success: 'Account has been successfully updated' });
}

export async function resetpwd(req,res){
    let email = null;
    let username = null;
    const checkUsername = await User.findOne({username : sanitize(req.params.input.toLowerCase())});
    if(!checkUsername){
        const checkEmail = await User.findOne({email : sanitize(req.params.input.toLowerCase())});
        if(!checkEmail){
            return res.status(400).json({ error: "Username/Email does not exist" });
        }
        email = checkEmail.email;
        username = checkEmail.username;
    }
    else{
        email = checkUsername.email;
        username = checkUsername.username;
    }
    if(!email){
        return res.status(400).json({ error: "You account was authoritized and created from other website, and your registed email is empty. Please try to login with google/github/42." });
    }
    const resetpwd_link = crypto.randomBytes(10).toString('hex');
    await User.findOneAndUpdate({username:username}, {$set: {resetPwdLink: resetpwd_link}});
    await emailSender.resetpwd(email, username,resetpwd_link);
    return res.status(200).json({ success: "An email has been sent to your email, please check to reset your password" });
}

export async function verifyPwdLink(req,res){
    const user = await User.findOne({ resetPwdLink: req.params.resetpwd_link})
    if(!user)
        return res.status(400).json({ error: "Link is not valid, you can make a new request" });
    return res.status(200).json({ 
        success: "Link validate, you can reset your password",
        data: user.username
    });
}

export async function updatepwd(req,res){
    User.findOneAndUpdate({ username:sanitize(req.body.username) }, {$set: {resetPwdLink: null}},(err, user) => {
        user.setPassword(req.body.password, ()=>{
            user.save().catch(err => {
                console.log(err);
            })
        })
    });  
    return res.status(200).json({ 
        success: "Password updated, you may login now"
    });
}
