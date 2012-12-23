var expect  = require('chai').expect,
    sinon   = require('sinon'),
    request = require('request'),
    fs      = require('fs'),
    Sequelize = require('sequelize'),
    _       = require('lodash');
;

process.env.FB_APP = 'ABC:XYZ';

var User = require(__dirname + '/../config/database').models.User;
var passport  = require('../config/passport');

describe('passport', function() {
  
  before(function(done) {
    User.findAll().complete(function(err, models) {
      User.destroyAll(models).complete(function(err, results) {        
        done()
      });
    });
  });
  
  describe('.facebookStrategy()', function() {
    var profile = require('./mocks/facebook-profile');
    var clock;
    var joinedAt = new Date();
    
    it('should save a new user to the database', function(done) {
      passport._strategies.facebook._verify('accessToken-mock', 'refreshToken-mock', profile, function(err, user) {
        joinedAt = user.joined_at;
        expect(user.joined_at).to.be.closeTo(joinedAt, 100);
        done();
      });
    });
    
    it("should update an existing user's last_login date", function(done) {
      clock = sinon.useFakeTimers(Date.now(), "Date");
      clock.tick(5000);
      passport._strategies.facebook._verify('accessToken-mock', 'refreshToken-mock', profile, function cb(err, user) {
        expect(user.last_login.getTime()).to.be.closeTo(joinedAt.getTime() + 5000, 100);
        clock.restore();
        done();
      });
    });
    
    it("should NOT update an existing user's joined_at date", function(done) {
      clock = sinon.useFakeTimers(Date.now(), "Date");
      clock.tick(5000);
      
      passport._strategies.facebook._verify('accessToken-mock', 'refreshToken-mock', profile, function cb(err, user) {
        expect(user.joined_at).to.be.closeTo(joinedAt, 100);
        clock.restore();
        done();
      });
    });
    
  });
});
