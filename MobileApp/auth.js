const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const { sendVerificationEmail } = require('./mailer');

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
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'All fields are required.'});
    }
    try {
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
        // Insert user into the prostgres database
        const query = 'INSERT INTO users_login (email, password, is_verified) VALUES ($1, $2, FALSE) RETURNING id, email';

        const result = await client.query(query, [email, hashedPassword]);
        const user = result.rows[0];
        const token = jwt.sign(
            {email: user.email},
            SECRET_KEY,
            {expiresIn: '15m'}
        );
        // const token = 'Harshit'

        const verificationURL = "http://10.5.122.238:3000/loading?token=" + token;
        await sendVerificationEmail(email, verificationURL);

        res.status(201).json({message: 'Registration Successful! Please Login Now.', userID: result.rows[0].id});
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({message: 'email Already Exist.'});
        }

        console.error('Error during registration:', error.message);
        res.status(500).json({message: 'Database error during registration.'});
    }
});
// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({message: 'All Fields are required.'});
    }
   try{
        const query = 'SELECT * FROM users_login WHERE email = $1';
        const result = await client.query(query, [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({message: 'Invalid email or Password.'});
        }
        const user = result.rows[0];

        if (!user.is_verified) {
            return res.status(403).json({message:'Please verify your email before logging in.'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({message: 'Invalid email or Password.'});
       }
        // Generating a JWT token
        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: '15m'});
        res.json({message: 'Login Successful!', token});
   } catch (error) {
        console.error('Error during Login:', error.message);
        res.status(500).json({message: 'Database error during Login.'});
   }
});
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    try {
        const query = 'SELECT * FROM users_login WHERE email = $1';
        const result = await client.query(query, [email]);

        if (result.rows.length === 0)
            return res.status(404).json({ message: 'Email not found.' });

        if (result.rows[0].is_verified)
            return res.status(200).json({ message: 'Email is already verified.' });

        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '15m' });

        const verificationURL = "http://10.5.122.238:3000/loading?token=" + token;
        await sendVerificationEmail(email, verificationURL);

        res.status(200).json({ message: 'New verification email sent.' });
    } catch (err) {
        console.error('Resend error:', err.message);
        res.status(500).json({ message: 'Failed to resend email.' });
    }
});
router.post('/verify-token', async (req, res) => {
    console.log("Received verification request"); // Debug log

    const { token } = req.body;
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token is required'
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Decoded token:", decoded); // Debug log

        const result = await client.query(
            'UPDATE users_login SET is_verified = TRUE WHERE email = $1 RETURNING email',
            [decoded.email]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error("Verification error:", error); // Debug log
        res.status(400).json({
            success: false,
            message: error.message.includes('expired')
                ? 'Token expired'
                : 'Invalid token'
        });
    }
});
module.exports = router;
