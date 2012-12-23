var BASE_URL = process.env.URL || 'http://localhost:3000';

var passport = require('passport'), 
    FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../config/database').models.User;

passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP.split(":")[0],
    clientSecret: process.env.FB_APP.split(":")[1],
    callbackURL: BASE_URL + "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    
    var protoUser = {
      name:        profile._json.name,
      first_name:   profile._json.first_name,
      last_name:    profile._json.last_name,
      email:       profile._json.email,
      timezone:    profile._json.timezone,
      locale:      profile._json.locale,
      provider:    "facebook",
      provider_id: profile.id,
      access_token: accessToken,
      last_login: new Date()
    };
        
    User.find({ where: { provider: 'facebook', provider_id: profile.id } }).complete(function(err, user) {
      if (user) {
        user.updateAttributes(protoUser).complete(function(err, user) {
          return done(null, user);
        })
      }
      else {
        protoUser.joined_at = new Date();
        User.create(protoUser).complete(function(err, user) {
          return done(err, user);
        });
      }   
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;