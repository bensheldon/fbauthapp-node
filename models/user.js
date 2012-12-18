var pg   = require('pg');
var mesa = require('mesa');

var getConnection = function(cb) { pg.connect(process.env.PG, cb) };

var user = module.exports = mesa
    .table('users')
    .connection(getConnection)
    .attributes([
      'name',       
      'firstName',  
      'lastName',   
      'email',      
      'timezone',   
      'locale',     
      'provider',   
      'providerId', 
      'joinedAt',   
      'lastLogin',  
    ]);