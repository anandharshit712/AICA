const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');  // Make sure this is properly defined

const router = express.Router();
const SECRET_KEY = 'your_secret_key';

// Registration Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    // Ensure password is a string
    if (typeof password !== 'string') {
        throw new Error('Password must be a string.');
    }

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Username already exists.' });
            }
            return res.status(500).json({ error: 'Database error.' });
        }
        res.status(201).json({ message: 'Registration successful. Please log in.' });
    });
} catch (err) {
    res.status(500).json({ error: 'Error hashing password: ' + err.message });
}
});

// Login Route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful.', token });
  });
});

module.exports = router;
