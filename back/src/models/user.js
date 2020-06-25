const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret');

const userSchema = new Schema({
    username:  { type: String, unique: true },
    firstname: String,
    lastname:   String,
    email:  { type: String, unique: true },
    avatar: { type: String, default: null },
    language: { type: String, default:"english" },
    resetPwdLink: String,
    watched: Array,
    watchLater: Array,
    oAuthId: String,
});

userSchema.methods.generateToken = function() {
    return jwt.sign(
        {
            userid: this._id,
            username: this.username
        },
        jwtSecret.jwtSecret,
        {
            expiresIn: 36000
        }
    );
};

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;