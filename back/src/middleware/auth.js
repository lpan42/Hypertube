const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret');

module.exports = function(req, res, next){
    const token = req.header('x-auth-token');
     if(!token){
         return res.status(401).json({
             error: 'No token, authorization denied'
         });
     }
     try{
         const decoded = jwt.verify(token, jwtSecret.jwtSecret);
         req.userid = decoded.userid;
         next();
    }catch(err){
        return res.status(401).json({
            error: 'Token is not valid'
        });
    }
}