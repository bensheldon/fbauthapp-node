var expect  = require('chai').expect,
    sinon   = require('sinon'),
    request = require('request'),
    fs      = require('fs')
;

process.env.PG = process.env.PG_TEST;

var User = require(__dirname + '/../models/user');

describe('User', function() {
  describe('.tableName', function() {
    it('should save a new user to the database', function(done) {
      // var userGet =  User.select().where({provider: 'facebook'});
      // User.db.query("SELECT * FROM users WHERE provider = $1", ['facebook'], function(err, user) {
      //   console.log(err, user);
      //   done();
      //   
      // })
      console.log(User.select().where({provider: 'facebook'}).sql())
      
      User.select().where({provider: 'facebook'}).query(function(err, user) {
        console.log(err, user);
        done();
        
      })
    });
  });
});
