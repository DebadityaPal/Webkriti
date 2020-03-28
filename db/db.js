const mysql = require('mysql');

const mySqlConnection = mysql.createConnection({
    host: "us-cdbr-iron-east-01.cleardb.net",
    user: "bd86227f11c666",
    password: "7a22f0e8",
    database: "heroku_39afc7b1d1ea309",
});

mySqlConnection.connect((err) => {
    if (err) console.log(err);
    console.log("Database Connected!");
});

module.exports = mySqlConnection;