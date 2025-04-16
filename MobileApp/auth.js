const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

const router = express.Router();
const SECRET_KEY = 'your_secret_key';

// PostgreSQL connection
const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: '16189251',
    database: 'login_audio_app',
    port: 5432,
});

client.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.message);
    } else {
        console.log('Connected to PostgreSQL for auth routes.');
    }
});

// Registration Route
router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({message: 'All fields are required.'});
    }
    try {
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
        // Insert user into the prostgres database
        const query = 'INSERT INTO users_login (username, password) VALUES ($1, $2) RETURNING id';
        const result = await client.query(query, [username, hashedPassword]);

        res.status(201).json({message: 'Registration Successful! Please Login Now.', userID: result.rows[0].id});
    } catch (error) {
        if (error.code === '23505') {
            return res.status(401).json({message: 'Username Already Exist.'});
        }
        console.error('Error during registration:', error.message);
        res.status(500).json({message: 'Database error during registration.'});
    }
});
// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(401).json({message: 'All Fields are required.'});
    }
   try{
        const query = 'SELECT * FROM users_login WHERE username = $1';
        const result = await client.query(query, [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({message: 'Invalid Username or Password.'});
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({message: 'Invalid Username or Password.'});
       }
        // Generating a JWT token
        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: '1h'});
        res.json({message: 'Login Successful!', token});
   } catch (error) {
        console.error('Error during Login:', error.message);
        res.status(500).json({message: 'Database error during Login.'});
   }
});
module.exports = router;
