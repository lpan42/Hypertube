const userModel = require('../models/user');
const jwtModel = require('../models/jwt');
// const emailSender = require('../models/emailSender');
const crypto = require('crypto');

export async function getAccount(req, res) {
    const result = await userModel.getUserInfoById(req.params.userid);
    if (typeof(result.err) !== 'undefined') {
        return res.status(400).json({ error: result.err });
    } else {
        return res.status(200).json({
            data: result
        });
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

export async function resetpwd(req,res){
    let email = null;
    let username = null;
    const checkUsername = await userModel.checkUsername(req.params.input);
    if(!checkUsername[0]){
        const checkEmail = await userModel.checkEmail(req.params.input);
        if(!checkEmail[0]){
            return res.status(400).json({ error: "Username/Email does not exist" });
        }
        email = checkEmail[0].email;
        username = checkEmail[0].username;
    }
    else{
        email = checkUsername[0].email;
        username = checkUsername[0].username;
    }
    const resetpwd_link = crypto.randomBytes(10).toString('hex');
    await userModel.updateResetpwdLink(username, resetpwd_link);
    await emailSender.resetpwd(email, username,resetpwd_link);
    return res.status(200).json({ success: "An email has been sent to your email, please check to reset your password" });
}

export async function verifyPwdLink(req,res){
    const username = await userModel.verifyPwdLink(req.params.resetpwd_link);
    if(!username){
        return res.status(400).json({ error: "Link is not valid, you can make a new request" });
    }
    return res.status(200).json({ 
        success: "Link validate, you can reset your password",
        data: username
    });
}

export async function updatepwd(req,res){
    await userModel.updatepwd(req.body.username, req.body.password);
    return res.status(200).json({ 
        success: "Password updated, you may login now"
    });
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

export async function modifyAccount(req,res){
    let data = {
        username:req.body.data.username,
        email: req.body.data.email,
        firstname: req.body.data.firstname,
        lastname: req.body.data.lastname,
    }
    const result = await userModel.modifyAccount(data, req.userid);
    if (typeof(result) !== 'undefined')
        return res.status(400).json({ error: result.err });
    else
        return res.status(200).json({ success: 'Account has been successfully updated' });
}

export async function getProfile(req, res) {
    if(!Number.isInteger(+req.params.userid)){
        return res.status(400).json({error: "UserID has to be a number."});
    }
    const getProfile = await userModel.getProfileInfoById(req.params.userid);
    if(getProfile.err)
        return res.status(400).json({error: getProfile.err});
    else{
        if (req.userid != req.params.userid) {
            let data = {
                // notification: 'visits',
                id_user: req.params.userid,
                id_sender: req.userid
            }
            const checkBlock = await userModel.checkBlock(data.id_user, data.id_sender);
            if(checkBlock[0]){
                return res.status(400).json({error: "You have blocked this user, you cannot check his/her profile anymore."});
            }
            // await userModel.addNotif(data);
            await userModel.addFame(1, data.id_user);
        }
        const result = await userModel.getProfileInfoById(req.params.userid);
        const interests = await userModel.getInterestsById(req.params.userid);
        result.interests = interests;
        const pictures = await userModel.getPictureById(req.params.userid);
        result.pictures = pictures;
        return res.status(200).json({
            data: result
        })
    }
}

export async function modifyProfile(req, res) {
    let data = req.body;
    data.id_user = req.userid;
    await userModel.modify_profile(data);
    return res.status(200).json({ success: 'Profile has been successfully updated' });
}

export async function modifyInterests(req, res) {
    let data = {};
    data.id_user = req.userid;
    data.interest = req.body;
    await userModel.modifyInterests(data);
    res.status(200).json({ success: 'Profile has been successfully updated' });
}

export async function setAllReaded(req,res){
    await userModel.setAllReaded(req.userid);
    const result = await userModel.getNotif(req.userid);
    return res.status(200).json({
        data: result
    });
}

export async function readNotif(req, res) {
    if(!Number.isInteger(+req.params.id_notif)){
        return res.status(400).json({error: "NotifID has to be a number."});
    }
    await userModel.readNotif(req.params.id_notif);
    const result = await userModel.getNotif(req.userid);
    return res.status(200).json({
        data: result
    });
}

// export async function getHistory(req, res){
//     if(!Number.isInteger(+req.params.userid)){
//         return res.status(400).json({error: "userID has to be a number."});
//     }
//     const result = await userModel.getHistory(req.params.userid);
//     return res.status(200).json({
//         data: result
//     });
// }

export async function checkLike(req,res){
    if(!Number.isInteger(+req.params.userid)){
        return res.status(400).json({error: "userID has to be a number."});
    }
    const result = await userModel.checkLike(req.params.userid, req.userid);
    let like = false;
    let connected = false;
    if(result[0]){
        like = true;
        const checklikeback = await userModel.checkLike(req.userid, req.params.userid);
        if(checklikeback[0]){
            connected = true;
        }
    }
    return res.status(200).json({
        like,
        connected
    });
}

export async function likeProfile(req,res) {
    if(!Number.isInteger(+req.params.userid)){
        return res.status(400).json({error: "userID has to be a number."});
    }
    if (req.userid != req.params.userid) {
        let data = {
            // notification: 'likes',
            id_user: req.params.userid,
            id_sender: req.userid
        }
        const checklike = await userModel.checkLike(data.id_user, data.id_sender);
        if(checklike[0]){
            return res.status(200).json({ 
                connected: false,
                success: 'You have liked this user before'});
        }
        else{
            await userModel.addLike(data.id_user, data.id_sender);
            await userModel.addFame(5, data.id_user);
            // await userModel.addNotif(data);
            const checklikeback = await userModel.checkLike(data.id_sender, data.id_user);
            if(checklikeback[0]){
                await chatModel.createChatroom(data.id_sender, data.id_user);
                return res.status(200).json({ 
                    connected: true,
                    success: 'This user also likes you, now you can chat'});
            }
            else return res.status(200).json({ 
                connected: false,
                success: 'liked'});
        }
    }
    else{
        return res.status(400).json({ error: 'You cannot like yourself'});
    }
}

export async function blockUser(req,res) {
    if(!Number.isInteger(+req.params.userid)){
        return res.status(400).json({error: "userID has to be a number."});
    }
    if (req.userid != req.params.userid) {
        let data = {
            // notification: 'blocks',
            id_user: req.params.userid,
            id_sender: req.userid
        }
        const checkBlock = await userModel.checkBlock(data.id_user, data.id_sender);
        if(checkBlock[0]){
            return res.status(200).json({ 
                success: 'You have blocked this user before'});
        }
        else{
            await userModel.addBlock(data.id_user, data.id_sender);
            await userModel.unlike(data.id_user, data.id_sender);
            const chatroom = await chatModel.getChatroomId(data.id_sender, data.id_user);
            if(chatroom){
                await chatModel.unlinkChat(chatroom.id_chatroom);
            }
            await userModel.addFame(-50, data.id_user);
            // await userModel.addNotif(data);
            return res.status(200).json({ 
                success: 'You have blocked this user, all your history about this user has been deleted, and you cannot get any information from this user'});
        }
    }
    else{
        return res.status(400).json({ error: 'You cannot block yourself'});
    }
}

export async function reportFake(req,res) {
    if(!Number.isInteger(+req.params.userid)){
        return res.status(400).json({error: "userID has to be a number."});
    }
    if (req.userid != req.params.userid) {
        let data = {
            // notification: 'blocks',
            id_user: req.params.userid,
            id_sender: req.userid
        }
        const checkFake = await userModel.checkFake(data.id_user, data.id_sender);
        if(checkFake[0]){
            return res.status(200).json({
                success: 'You have report this user as a fake account before'});
        }
        else{
            await userModel.addFake(data.id_user, data.id_sender);
            await userModel.addBlock(data.id_user, data.id_sender);
            await userModel.unlike(data.id_user, data.id_sender);
            const chatroom = await chatModel.getChatroomId(data.id_sender, data.id_user);
            if(chatroom){
                await chatModel.unlinkChat(chatroom.id_chatroom);
            }
            await userModel.addFame(-500, data.id_user);
            const count = await userModel.countFake(data.id_user);
            if(count >= 5){
                await userModel.deleteUser(data.id_user);
                return res.status(200).json({ 
                    success: 'There are more than 5 users report this account as a fake account. This account has been deleted!'});
            }
            return res.status(200).json({ 
                success: 'You have reported this user as a fake account, you will consider as block this user'});
        }
    }
    else{
        return res.status(400).json({ error: 'You cannot block yourself'});
    }
}

export async function unlikeProfile(req,res) {
    if(!Number.isInteger(+req.params.userid)){
        return res.status(400).json({error: "userID has to be a number."});
    }
    if (req.userid != req.params.userid) {
        let data = {
            // notification: 'unlikes',
            id_user: req.params.userid,
            id_sender: req.userid
        }
        const checklike = await userModel.checkLike(data.id_user, data.id_sender);
        if(!checklike[0]){
            return res.status(400).json({ error: 'You have not liked this user before'});
        }
        else{
            await userModel.unlike(data.id_user, data.id_sender);
            await userModel.addFame(-5, data.id_user);
            // await userModel.addNotif(data);
            const checklikeback = await userModel.checkLike(data.id_sender, data.id_user);
            if(checklikeback[0]){// means they are connected user
                const chatroom = await chatModel.getChatroomId(data.id_sender, data.id_user);
                await chatModel.unlinkChat(chatroom.id_chatroom);
                return res.status(200).json({
                    connected: false,
                    success: 'You unlike this user, you are not connected anymore, all your previous messages has been destoryed'});
            }
            else
                return res.status(200).json({
                    connected: false,
                    success: 'You unlike this user'});
        }
    }
}

export async function getInterestsList(req,res) {
    const result = await userModel.getInterestsList();
    return res.status(200).json({
        data: result
    });
}

export async function uploadAvatar(req,res) {
    if(req.files == null){
        return res.status(400).json({ error: 'No file was uploaded'});
    }
    const file = req.files.file;
    const filename = req.userid + crypto.randomBytes(5).toString('hex');
    file.mv(`../front/public/images/${filename}`, err => {
        if(err){
            return res.status(500).send(err);
        }
    });
    await userModel.uploadAvatar(req.userid, "http://localhost:3000/images/"+filename);
    return res.status(200).json({
        success: "You avatar has been updated successfully"
    });
}

export async function modifyPictures(req, res){
    const getCurrent = await userModel.getPictureById(req.userid);//must have previous pics
    // if(req.body.length){
        for(let i = 0; i < getCurrent.length; i++) {
            let check = false;
            for(let ii = 0; ii < req.body.length; ii++){
                if(getCurrent[i].path === req.body[ii].path)
                {
                    check = true;
                    break ;
                }
            }
            if(check === false){
                await userModel.deletePics(getCurrent[i].path);
            }
        }
    // }
    return res.status(200);
}

export async function uploadPictures(req, res){
    if(req.files == null){
        return res.status(200);
    }
    const files = req.files.file;
    if(Array.isArray(files)){
        for(let i = 0; i < files.length; i++){
            const filename = req.userid + crypto.randomBytes(5).toString('hex');
            files[i].mv(`../front/public/images/${filename}`, err => {
                if(err){
                    console.log(err);
                    return res.status(500).send(err);
                }
            });
            await userModel.uploadPics(req.userid, "http://localhost:3000/images/"+filename);
        }
    }else{
        const filename = req.userid + crypto.randomBytes(5).toString('hex');
        files.mv(`../front/public/images/${filename}`, err => {
            if(err){
                console.log(err);
                return res.status(500).send(err);
            }
        });
        await userModel.uploadPics(req.userid, "http://localhost:3000/images/"+filename);
    }
    return res.status(200);
}

export async function getBlockList(req, res){
    const result = await userModel.getBlockList(req.userid);
    return res.status(200).json({
        data: result
    });
}
export async function getLikeList(req, res){
    const result = await userModel.getLikeList(req.userid);
    return res.status(200).json({
        data: result
    });
}

export async function getVisitList(req, res){
    const result = await userModel.getVisitList(req.userid);
    return res.status(200).json({
        data: result
    });
}

export async function unBlockUser(req, res){
    const userid = req.params.blockuserid;
    const blockerid = req.userid;
    await userModel.unBlockUser(userid, blockerid);
    await userModel.addFame(50, userid);
    return res.status(200).json({
        success: "You have unblocked this user, you can now visit his profile"
    });
}

//get chatroom and message
