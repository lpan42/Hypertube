const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OAuth2Strategy = require("passport-oauth2").Strategy;
const User = require('../models/user');
const config = require('../config/oAuthIds');
const axios = require('axios').default;

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
          user = User.findOneAndUpdate({email : profile.email},{$set:{
            oAuthId: profile.id, 
            avatar: profile._json.avatar_url ? profile._json.avatar_url : null
          }},(err) => {
            if(err) return done(err);
          });
          return done(err,user);
        }
      }
      return done(err,user);
    });
  }));

  passport.use(new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
      scope: ["profile","email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      User.findOne({ oAuthId: profile.id }, async (err, user) => {
        if(err)
          return done(err);
        if(!user){
          const check_email = await User.findOne({ email : profile.emails[0].value});
          if(!check_email){
            user = new User({
              username: (!await User.findOne({ username : profile.username })) ? profile.username : profile.id,
              firstname:  profile.name.familyName ?  profile.name.familyName.toLowerCase(): null,
              lastname: profile.name.givenName ? profile.name.givenName.toLowerCase(): null,
              email: profile.emails[0] ? profile.emails[0].value.toLowerCase(): null,
              avatar: profile.photos[0] ? profile.photos[0].value : null,
              oAuthId: profile.id
            });
            user.save(err => {if (err) return done(err);});
            return done(err,user);
          }else{
            user = await User.findOneAndUpdate({email : profile.emails[0].value},{$set:{
              oAuthId: profile.id,
              avatar: profile.photos[0] ? profile.photos[0].value : null,
            }},(err) => {
              if(err) return done(err);
            });
            return done(err,user);
          }
        }
        else
          return done(err,user);
      });
    }));

    passport.use(new OAuth2Strategy(
      {
        authorizationURL: config.oauth2.authorizationURL,
        tokenURL:config.oauth2.tokenURL,
        clientID: config.oauth2.clientID,
        clientSecret: config.oauth2.clientSecret,
        callbackURL: config.oauth2.callbackURL,
        scope: ["public"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const config = {
          headers: {
            Authorization: "Bearer " + accessToken
          }
        }
        try{
          profile = await axios.get('https://api.intra.42.fr/v2/me', config);
          User.findOne({ oAuthId: profile.data.id }, async (err, user) => {
            if(err)
              return done(err);
            if(!user){
              const check_email = await User.findOne({ email : profile.data.email});
              if(!check_email){
                user = new User({
                  username: (!await User.findOne({ username : profile.data.login })) ? profile.data.login : profile.data.id,
                  firstname:  profile.data.first_name ?  profile.data.first_name.toLowerCase(): null,
                  lastname: profile.data.last_name ? profile.data.last_name.toLowerCase(): null,
                  email: profile.data.email ? profile.data.email.toLowerCase(): null,
                  avatar: profile.data.image_url ? profile.data.image_url : null,
                  oAuthId: profile.data.id
                });
                user.save(err => {if (err) return done(err);});
                return done(err,user);
              }else{
                user = await User.findOneAndUpdate({email : profile.data.email },{$set:{
                  oAuthId: profile.data.id,
                  avatar: profile.data.image_url ? profile.data.image_url : null,
                }},(err) => {
                  if(err) return done(err);
                });
                return done(err,user);
              }
            }
            else
              return done(err,user);
          });
        }catch(err){
          console.log(err);
        }
      }));