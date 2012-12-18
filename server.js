var __       = require('lodash'),
    express  = require('express'),
    app      = express(),
    BASE_URL = process.env.URL || 'http://localhost:3000'
    PORT     = process.env.PORT || 3000;
    
var User = require('./models/user');
    
var passport         = require('passport'), 
    FacebookStrategy = require('passport-facebook').Strategy;
    
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP.split(":")[0],
    clientSecret: process.env.FB_APP.split(":")[1],
    callbackURL: BASE_URL + "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log("accessToken:",  accessToken);
    // console.log("refreshToken:",  refreshToken);
    // console.log("profile:",  profile);
    
    var protoUser = {
      name:        profile._json.name,
      firstName:   profile._json.first_name,
      lastName:    profile._json.last_name,
      email:       profile._json.email,
      timezone:    profile._json.timezone,
      locale:      profile._json.locale,
      provider:    "facebook",
      provider_id: profile.id,
      lastLogin: new Date()
    };
      
    User.findOne({ where: { provider: "facebook", provider_id: profile.id } }, function(err, user) {
      if (user) {
        user.updateAttributes(protoUser, function(err) {
          return done(null, user);
        })
      }
      else {
        var user = new User(protoUser);
        user.save(function(err) {
          console.log(user);
          return done(null, user);
        });
      }   
    });
  }
));

// configure Express
app.configure(function() {
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

// GET /auth/facebook: sends the user to Facebook
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

// GET /auth/facebook/callback: Catch the redirection back from Facebook
app.get('/auth/facebook/callback',
  // Make sure the user is actually authenticated and log them in
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// This checks the current users auth
// It runs before Backbones router is started
// we should return a csrf token for Backbone to use
app.get('/session', function(req, res){
  if(typeof req.user !== 'undefined'){
    res.send(__.extend({ auth: true }, req.user));
  } else {
    res.send({auth: false });
  }
});

app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);