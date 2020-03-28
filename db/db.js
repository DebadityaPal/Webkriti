const mysql = require('mysql');

var mySqlConnection = mysql.createPool({
    host: "us-cdbr-iron-east-01.cleardb.net",
    user: "bd86227f11c666",
    password: "7a22f0e8",
    database: "heroku_39afc7b1d1ea309",
});

module.exports = mySqlConnection;
