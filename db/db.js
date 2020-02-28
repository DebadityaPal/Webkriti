const mysql = require('mysql');

const mySqlConnection = mysql.createConnection({
    host: "localhost",
    user: "webkriti",
    password: "webkriti",
    database: "webkriti",
});

mySqlConnection.connect((err) => {
    if (err) console.log(err);
    console.log("Database Connected!");
});

module.exports = mySqlConnection;