const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'Ass',
    password : 'Ass97',
    database : 'todolist'
});

connection.connect();

module.exports = connection;