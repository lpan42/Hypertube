const User = require('../models/user');
// const emailSender = require('../models/emailSender');
const crypto = require('crypto');
const sanitize = require('mongo-sanitize');
const passport = require("passport");
require("../middleware/passportAuthLocal");

export async function getAccount(req, res) {
    if(req.params.userid === req.userid){
        const user = await User.findOne({ _id: req.params.userid });
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
        };  
        return res.status(200).json({
            data: result
        });
    }
    else{
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
        };
        return res.status(200).json({
            data: result
        });
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
            };
            // req.session.user = result;
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
    const user = await User.findOne({ _id: req.userid});
    if (!user) {
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
    };
    return res.status(200).json({
        data: result,
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
    const result = await User.updateOne({_id:req.userid},{$set:data});
    if (result.ok !== 1)
        return res.status(400).json({ error:"Update failed" });
    return res.status(200).json({ success: 'Account has been successfully updated' });
}
// export async function resetpwd(req,res){
//     let email = null;
//     let username = null;
//     const checkUsername = await userModel.checkUsername(req.params.input);
//     if(!checkUsername[0]){
//         const checkEmail = await userModel.checkEmail(req.params.input);
//         if(!checkEmail[0]){
//             return res.status(400).json({ error: "Username/Email does not exist" });
//         }
//         email = checkEmail[0].email;
//         username = checkEmail[0].username;
//     }
//         email = checkUsername[0].email;
//         username = checkUsername[0].username;
//     }
//     const resetpwd_link = crypto.randomBytes(10).toString('hex');
//     await userModel.updateResetpwdLink(username, resetpwd_link);
//     await emailSender.resetpwd(email, username,resetpwd_link);
//     return res.status(200).json({ success: "An email has been sent to your email, please check to reset your password" });
// }

// export async function verifyPwdLink(req,res){
//     const username = await userModel.verifyPwdLink(req.params.resetpwd_link);
//     if(!username){
//         return res.status(400).json({ error: "Link is not valid, you can make a new request" });
//     }
//     return res.status(200).json({ 
//         success: "Link validate, you can reset your password",
//         data: username
//     });
// }

// export async function updatepwd(req,res){
//     await userModel.updatepwd(req.body.username, req.body.password);
//     return res.status(200).json({ 
//         success: "Password updated, you may login now"
//     });
// }

