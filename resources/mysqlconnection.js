const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'sql-ftos-material',
});
connection.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
    } else {
        console.log('Connected to MySQL database!');
    }
});
module.exports = connection;

