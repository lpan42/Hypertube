const connection = require('../config/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const moment = require('moment');
const fs = require('fs');
// const emailSender = require('./emailSender');

export async function getUserInfoById(userid) {
    try {
        const result = await connection.query(`
        SELECT users.id_user,username,firstname,lastname,email,avatar,language FROM users 
        WHERE users.id_user = ?
        `, userid);
        if (result[0]) {
            const user = {
                id: result[0].id_user,
                username: result[0].username,
                email: result[0].email,
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                avatar: result[0].avatar,
                language: result[0].language,
            };
            return user;
        } else {
            return { err: "This user does not exist" };
        }
    } catch (err) {
        throw new Error(err);
    }
}

export async function verifyExistEmail(email, userid) {
    try {
        const result = await connection.query('SELECT email, id_user FROM users WHERE email = ?', email.toLowerCase());
        if(result[0] && result[0].id_user != userid)
            return { err: 'This email has been used' };
    } catch (err) {
        throw new Error(err);
    }
}

export async function verifyExistUsername(username, userid) {
    try {
        const result = await connection.query('SELECT username,id_user FROM users WHERE username = ?', username.toLowerCase());
        if (result[0] && result[0].id_user != userid) {
            return { err: 'This username has been taken' };
        }
    } catch (err) {
        throw new Error(err);
    }
}

export async function checkUsername(username){
    try {
        const result = await connection.query('SELECT email,username FROM users WHERE username = ?', username.toLowerCase());
        return result;
    } catch (err) {
        throw new Error(err);
    }
}

export async function checkEmail(email){
    try {
        const result = await connection.query('SELECT email,username FROM users WHERE email = ?', email.toLowerCase());
        return result;
    } catch (err) {
        throw new Error(err);
    }
}

// export async function updateResetpwdLink(username, resetpwd_link){
//     try {
//         await connection.query('UPDATE users set ini_pwd_link = ? where username = ?',[resetpwd_link,username]);
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function updatepwd(username, password){
//     const hash = bcrypt.hashSync(password, 10);
//     try {
//         await connection.query('UPDATE users set password = ? where username = ?',[hash, username.toLowerCase()]);
//     } catch (err) {
//         throw new Error(err);
//     }
// }

export async function createNewUser(body) {
    const hash = bcrypt.hashSync(body.password, 10);
    const data = {
        email: body.email.toLowerCase(),
        username: body.username.toLowerCase(),
        firstname: body.firstname.toLowerCase(),
        lastname: body.lastname.toLowerCase(),
        password: hash,
    };
    try {
        const result = await connection.query('INSERT INTO users SET ?', data);
    } catch (err) {
        throw new Error(err);
    }
}

// export async function verifyLink(active_link){
//     try{
//         const result = await connection.query('UPDATE users set active = 1, active_link = NULL where active_link = ?', active_link);
//         return result.affectedRows;
//     }catch (err) {
//         throw new Error(err);
//     }
// }


// export async function verifyPwdLink(resetpwd_link){
//     try{
//         const result = await connection.query('SELECT username FROM users where ini_pwd_link = ?', resetpwd_link);
//         if(result[0]){
//             return result[0].username;
//         }
//     }catch (err) {
//         throw new Error(err);
//     }
// }

export async function login(data) {
    try {
        const check = await connection.query('SELECT * FROM users WHERE username = ?', data.username.toLowerCase());
        if (!check[0])
            return { err: 'User does not exit, please create an account first' };
        else if (!bcrypt.compareSync(data.password, check[0].password))
            return { err: 'password unmatched, try again' };
        else {
            const user = {
                userid: check[0].id_user,
                username: check[0].username,
            };
            return user;
        }
    } catch (err) {
        throw new Error(err);
    }
}

// export async function logout(userid) {
//     try {
//         await connection.query('UPDATE users set online = 0 where id_user = ?', userid);
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function getProfileInfoById(userid) {
//     try {
//         const result = await connection.query(
//             `SELECT profiles.id_user, gender, birthday, sex_prefer, biography, location_lat, location_lon, avatar, fame, username, firstname, lastname, last_login, online
//             FROM profiles 
//             LEFT JOIN users on profiles.id_user = users.id_user
//             WHERE profiles.id_user = ?`,
//             userid);
//         if(!result[0]){
//             return { err: 'User does not exist' };
//         } else {
//             return result[0];
//         }
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function getCreateProfile(userid){
//     try {
//         const result = await connection.query(`SELECT id_user, username, firstname, lastname, last_login, online FROM users WHERE id_user = ?`,userid);
//         return result[0];
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function getInterestsById(userid) {
//     try {
//         const result = await connection.query(`
//             SELECT interest FROM interests 
//             LEFT JOIN users_interests on interests.id_interest = users_interests.id_interest
//             WHERE users_interests.id_user = ?`, 
//         userid);
//         return result;
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function getPictureById(userid){
//     try {
//         const result = await connection.query(`
//             SELECT path FROM pics 
//             WHERE id_user = ?`, 
//         userid);
//         return result;
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function addFame(fame, userid) {
//     try {
//         await connection.query('SET @i = ?; UPDATE profiles SET fame = fame + @i WHERE id_user = ?', [fame, userid]);
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function addNotif(data) {
//     try {
//         await connection.query('INSERT INTO notifications SET ?', data);
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function getNotif(userid) {
//     try {
//         const result = await connection.query(`
//         SELECT id_notif, id_sender, users.firstname, users.lastname, users.online, profiles.avatar, notification, notif_time, readed
//         FROM notifications 
//         LEFT JOIN users on notifications.id_sender = users.id_user
//         LEFT JOIN profiles on notifications.id_sender = profiles.id_user
//         WHERE notifications.id_user = ? 
//         ORDER BY notif_time DESC`
//         , [userid]);
//         return (result);
//     } catch (err) {
//         throw new Error(err);
//     }
// }
// export async function setAllReaded(userid){
//     try{
//         await connection.query('UPDATE notifications SET readed = 1 WHERE id_user = ?', userid);
//     }catch (err) {
//         throw new Error(err);
//     }
// }

// export async function readNotif(id_notif){
//     try{
//         await connection.query('UPDATE notifications SET readed = 1 WHERE id_notif = ?', id_notif);
//     }catch (err) {
//         throw new Error(err);
//     }   
// }

// export async function modifyAccount(data, userid) {
//     const email = await verifyExistEmail(data.email, userid);
//     if(typeof(email) !== 'undefined'){
//         return { err: 'This email has been used by another user' };
//     }
//     const username = await verifyExistUsername(data.username, userid);
//     if(typeof(username) !== 'undefined'){
//         return { err: 'Username has been taken.' };
//     }
//     try {
//         await connection.query('UPDATE users SET ? WHERE id_user = ?', [data, userid]);
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function modify_profile(data) {
//     try {
//         const profile = await connection.query('SELECT id_user FROM profiles WHERE id_user = ?', [data.id_user]);
//         if (!profile[0]) {
//             try {
//                 await connection.query('INSERT INTO profiles set ?', [data]);
//             } catch (err) {
//                 throw new Error(err);
//             }
//         } else {
//             try {
//                 await connection.query('UPDATE profiles set ? WHERE id_user = ?', [data, data.id_user]);
//             } catch (err) {
//                 throw new Error(err);
//             }
//         }
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function modifyInterests(data) {
//     try{
//         await connection.query('DELETE FROM users_interests WHERE id_user = ?', data.id_user);
//     }catch(err){
//         throw new Error(err);
//     }
//     data.interest.map( async (interest) => {
//         try{
//             const id_interest = await connection.query('SELECT id_interest FROM interests WHERE interest = ?', interest.interest);
//             try{
//                 await connection.query(' INSERT INTO users_interests (id_user, id_interest) VALUES (?,?)',
//                      [data.id_user, id_interest[0].id_interest])
//             }catch (err) {
//                 throw new Error(err);
//             }
//         }catch (err) {
//             throw new Error(err);
//         }
//     })
// }

// export async function checkLike(userid, likerid){
//     try{
//         const result = await connection.query("SELECT * FROM likes WHERE id_user = ? AND id_sender = ?", [userid, likerid]);
//         return result;
//     }catch (err) {
//         throw new Error(err);
//     }
// }

// export async function addLike(userid, likerid){
//     try {
//         await connection.query('INSERT INTO likes (id_user, id_sender) VALUES (?, ?)', [userid, likerid]);
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function checkBlock(userid, blockerid){
//     try{
//         const result = await connection.query("SELECT * FROM blocks WHERE id_user = ? AND id_sender = ?", [userid, blockerid]);
//         return result;
//     }catch (err) {
//         throw new Error(err);
//     }
// }

// export async function checkFake(userid,senderid){
//     try{
//         const result = await connection.query("SELECT * FROM fakes WHERE id_user = ? AND id_sender = ?", [userid, senderid]);
//         return result;
//     }catch (err) {
//         throw new Error(err);
//     }
// }

// export async function addBlock(userid, blockerid){
//     try {
//         await connection.query('INSERT INTO blocks (id_user, id_sender) VALUES (?, ?)', [userid, blockerid]);
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function countFake(userid){
//     try {
//         const result = await connection.query('SELECT COUNT(id_user) AS count FROM Fakes WHERE id_user = ?', userid);
//         return (result[0].count);
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function addFake(userid, senderid){
//     try {
//         await connection.query('INSERT INTO fakes (id_user, id_sender) VALUES (?, ?)', [userid, senderid]);
        
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function unlike(userid, unlikerid){
//     try{
//         await connection.query('DELETE FROM likes WHERE id_user = ? AND id_sender = ?;', [userid, unlikerid]);
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }

// export async function getInterestsList(){
//     try{
//         const result = await connection.query('SELECT interest FROM interests;');
//         return result;
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }

// export async function uploadAvatar(userid, filename){
//     const profile = await connection.query('SELECT id_user, avatar FROM profiles WHERE id_user = ?', userid);
//     if (!profile[0]) {
//         try {
//             await connection.query('INSERT INTO profiles ( avatar, id_user) VALUES (?, ?)', [filename, userid]);
//         } catch (err) {
//             throw new Error(err);
//         }
//     }else{
//         if(profile[0].avatar){
//             let filename = profile[0].avatar.split("/");
//             fs.unlink(`../front/public/images/${filename[filename.length-1]}`, err => {
//                 console.log(err);
//             });
//         }
//         try{
//             await connection.query('UPDATE profiles SET avatar = ? WHERE id_user = ?', [filename, userid]);
//         } 
//         catch (err) {
//             throw new Error(err);
//         }
//     }
// }

// export async function uploadPics(userid, filename){
//     try {
//         await connection.query('INSERT INTO pics ( id_user, path ) VALUES (?, ?)', [userid, filename]);
//     } catch (err) {
//         throw new Error(err);
//     }
// }

// export async function deletePics(path){
//     let filename = path.split("/");
//     fs.unlink(`../front/public/images/${filename[filename.length-1]}`, err => {
//         console.log(err);
//     });
//     try{
//         await connection.query('DELETE FROM pics WHERE path = ?', path);
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }

// export async function getBlockList(userid){
//     try{
//         const result = await connection.query(`
//             SELECT blocks.id_user, users.firstname, users.lastname,  users.username, users.online, profiles.avatar
//             FROM blocks 
//             LEFT JOIN users on blocks.id_user = users.id_user
//             LEFT JOIN profiles on blocks.id_user = profiles.id_user
//             WHERE blocks.id_sender = ? 
//             ORDER BY block_time DESC`, userid);
//         return result;
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }

// export async function unBlockUser(userid, blockerid){
//     try{
//         await connection.query('DELETE FROM blocks WHERE id_user = ? and id_sender = ?',
//         [userid, blockerid]);
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }

// export async function getVisitList(userid){
//     try{
//         const result = await connection.query(`
//             SELECT notifications.id_user, notification, notif_time,  users.online, users.username, users.firstname, users.lastname, profiles.avatar
//             FROM notifications 
//             LEFT JOIN users on notifications.id_user = users.id_user
//             LEFT JOIN profiles on notifications.id_user = profiles.id_user
//             WHERE notifications.id_sender = ? AND notifications.notification = 'visits'
//             ORDER BY notif_time DESC`, userid);
//         return result;
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }

// export async function getLikeList(userid){
//     try{
//         const result = await connection.query(`
//             SELECT notifications.id_user, notification, notif_time,  users.online, users.username, users.firstname, users.lastname, profiles.avatar
//             FROM notifications 
//             LEFT JOIN users on notifications.id_user = users.id_user
//             LEFT JOIN profiles on notifications.id_user = profiles.id_user
//             WHERE notifications.id_sender = ? AND notifications.notification = 'likes'
//             ORDER BY notif_time DESC`, userid);
//         return result;
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }

// export async function deleteUser(userid){
//     try{
//         const result = await connection.query(`
//             DELETE FROM users WHERE id_user = '${userid}';
//             DELETE FROM blocks WHERE id_user = '${userid}' OR id_sender = '${userid}';
//             DELETE FROM chatrooms WHERE id_user_1 = '${userid}' OR id_user_2 = '${userid}';
//             DELETE FROM fakes WHERE id_user = '${userid}' OR id_sender = '${userid}';
//             DELETE FROM likes WHERE id_user = '${userid}' OR id_sender = '${userid}';
//             DELETE FROM messages WHERE id_user = '${userid}' OR id_sender = '${userid}';
//             DELETE FROM notifications WHERE id_user = '${userid}' OR id_sender = '${userid}';
//             DELETE FROM pics WHERE id_user = '${userid}';
//             DELETE FROM profiles WHERE id_user = '${userid}';
//             DELETE FROM users_interests WHERE id_user = '${userid}';
//         `);
//         return result;
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }
