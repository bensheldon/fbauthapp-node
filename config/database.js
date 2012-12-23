var Sequelize = require('sequelize'),
    url = require('url'),
    _   = require('lodash');

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  conString = process.env.PG;
}
else if (process.env.NODE_ENV === 'test') {
  conString = process.env.PG_TEST || 'postgres://postgres:@localhost:5432/fbauth_test';
}

// Parse the database connection string
var conParsed = url.parse(conString);

var username = conParsed.auth.split(':')[0],
    password = conParsed.auth.split(':')[1],
    host     = conParsed.hostname,
    port     = conParsed.port,
    database = conParsed.pathname.slice(1);
    
var sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  protocol: 'postgres', // for heroku
  dialect: 'postgres',

  // disable logging; default: console.log
  logging: false,
 
  omitNull: true,
 
  // sync after each association (see below). If set to false, you need to sync manually after setting all associations. Default: true
  syncOnAssociation: true,
 
  pool: { maxConnections: 5, maxIdleTime: 30},
  maxConcurrentQueries: 50,
  
  // Specify options, which are used when sequelize.define is called.
  define: {
    underscored: true,
    timestamps: false,
    classMethods: {
      destroyAll: destroyAll
    }
  },

});

sequelize.models = {};

sequelize.models.User = sequelize.import(__dirname + "/../models/user");

module.exports = sequelize;


function destroyAll(models) {
  var chainer = new Sequelize.Utils.QueryChainer();
  _.each(models, function(m, index) {
      chainer.add(m.destroy());
  });
  return chainer.run();
}