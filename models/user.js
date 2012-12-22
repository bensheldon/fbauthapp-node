var db     = require(__dirname + '/../config/database'),
    _      = require('lodash');

var tableName = 'users';

module.exports = db.table(tableName);

