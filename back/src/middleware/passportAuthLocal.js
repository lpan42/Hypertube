const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({
        username: 'username',
        password: 'password'
    },
    (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Username doest not exsit.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
        });
}));
