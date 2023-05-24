const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistem_pakar',
});

con.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log('Connected!');
});

module.exports = { con };
