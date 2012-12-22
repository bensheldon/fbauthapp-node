var __       = require('lodash'),
    express  = require('express'),
    app      = express(),
    BASE_URL = process.env.URL || 'http://localhost:3000'
    PORT     = process.env.PORT || 3000;
    passport = require('./config/passport.js');
    
var User = require('./models/user');

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
  passport.authenticate('facebook', { failureRedirect: '/login' }), 
  function(req, res) {
    res.redirect('/');
  }
);

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