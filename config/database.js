require('coffee-script'); // required for mohair

var _      = require('lodash'),
    anyDB  = require('any-db'),
    mohair = require('mohair');

var conString, pool, db;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  conString = process.env.PG;
}
else {
  conString = process.env.PG_TEST;
}

pool = anyDB.createPool(conString, {min: 2, max: 10});

db = _.extend({}, mohair, {
  query: function(callback) {
    console.log(this.sql().replace(/\?/g, '$1'));
    // Using the question mark instead of numbered placement is freakin' UGLY!
    return pool.query(this.sql().replace(/\?/g, '$1'), this.params(), callback);
  },
  db: pool
});

module.exports = db;