const mysql = require('mysql');

// MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '16189251#Pk', // Your MySQL password
    database: 'login_audio_app', // Your database name
    port: 3306,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});
module.exports = db;
