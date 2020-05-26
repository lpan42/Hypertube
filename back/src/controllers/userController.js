const userModel = require('../models/user');
const jwtModel = require('../models/jwt');
// const emailSender = require('../models/emailSender');
const crypto = require('crypto');
const fs = require('fs');

export async function getAccount(req, res) {
    if(req.userid === req.params.userid){
        const result = await userModel.getUserInfoById(req.params.userid);
        if (typeof(result.err) !== 'undefined') {
            return res.status(400).json({ error: result.err });
        } else {
            return res.status(200).json({
                data: result
            });
        }
    }
    else{
        const result = await userModel.getVisitInfoById(req.params.userid);
        if (typeof(result.err) !== 'undefined') {
            return res.status(400).json({ error: result.err });
        } else {
            return res.status(200).json({
                data: result
            });
        }
    }
}

export async function register(req, res) {
    const check_email = await userModel.verifyExistEmail(req.body.email);
    if (typeof(check_email) !== 'undefined') {
        return res.status(400).json({ error: check_email.err });
    } else {
        const check_username = await userModel.verifyExistUsername(req.body.username);
        if (typeof(check_username) !== 'undefined') {
            return res.status(400).json({ error: check_username.err });
        } else {
            await userModel.createNewUser(req.body);
            return res.status(200).json({ 
                success: 'Successfully register. You may login now',
            });
        }
    }
}

export async function login(req, res) {
    const result = await userModel.login(req.body);
    if (typeof(result.err) !== 'undefined') {
        return res.status(400).json({ error: result.err });
    } else {
        const token = jwtModel.generateToken(result.userid, result.username);
        return res.status(200).json({
            success: 'sucessfully login',
            data: result,
            token: token
        });
    }
}

export async function authUser(req, res){
    const result = await userModel.getUserInfoById(req.userid);
    if (typeof(result.err) !== 'undefined') {
        return res.status(400).json({ error: result.err });
    } else {
        return res.status(200).json({
            data: result,
        });
    }
}

export async function logout(req, res) {
    await userModel.logout(req.userid);
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
    await userModel.uploadAvatar(req.userid, "http://localhost:3000/images/"+filename);
    return res.status(200);
}

export async function modifyAccount(req,res){
    if(req.userid !== req.body.id){
        return res.status(400).json({ error: "This is not your account."});
    }
    let data = {
        username:req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        language: req.body.language
    }
    const result = await userModel.modifyAccount(data, req.userid);
    if (typeof(result) !== 'undefined')
        return res.status(400).json({ error: result.err });
    else
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
//     else{
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