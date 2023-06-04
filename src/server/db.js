const mysql = require('mysql2');
const fs = require("fs");
const path = require("path")
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port:process.env.DB_PORT,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl:{
    ca: fs.readFileSync(__dirname + "\\ssl\\" + process.env.SSL_CERTIFICATE_FILE_NAME)
  }
});
connection.connect(function(err) {
    if (err) throw err;
    else console.log("DB connected");
});

module.exports = connection;
