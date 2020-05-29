const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');
const config = require('../config/oAuthIds');

passport.use(new GitHubStrategy(
  {
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL,
  },
  async (accessToken, refreshToken, profile, done) => {
    User.findOne({ oAuthId: profile.id }, async (err, user) => {
      if(err)
        return done(err);
      if(!user){
        const check_email = await User.findOne({ email : profile.email });
        if(!check_email){
          user = new User({
            username: (!await User.findOne({ username : profile.username })) ? profile.username : profile.id,
            firstname: profile.displayName ? profile.displayName.split(" ")[0].toLowerCase(): null,
            lastname:profile.displayName ? profile.displayName.split(" ")[1].toLowerCase(): null,
            email: profile._json.email ? profile._json.email.toLowerCase(): null,
            avatar: profile._json.avatar_url ? profile._json.avatar_url : null,
            oAuthId: profile.id
          });
          user.save(err => {if (err) return done(err);});
          return done(err,user);
        }else{
          User.updateOne({email : profile.email},{$set:{oAuthId: profile.id}},(err) => {
            if(err) return done(err);
          });
          return done(err,user);
        }
      }
      return done(err,user);
    });
  }));