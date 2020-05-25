const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret');

export function generateToken (id, username) {
    const token = jwt.sign(
        {
            userid: id,
            username: username
        },
        jwtSecret.jwtSecret,
        {
            expiresIn: 36000
        }
    );
    return token;
}
