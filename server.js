const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for the signup page)
app.use(express.static(path.join(__dirname, 'public')));

// Route: Serve Signup Page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

// API: Handle Signup Form Submission
app.post('/api/signup', (req, res) => {
  const { username, email, message } = req.body;

  if (!username || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields (username, email, and message) are required.',
    });
  }

  // Here, you could save the data to a database (not implemented for simplicity)

  res.status(200).json({
    success: true,
    message: 'Thank You for Joining!',
  });
});

// Fallback Route for 404 Errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found. Please check the URL.',
  });
});

// Start the Server
app.listen(port, () => {
  console.log(Server running at http://localhost:${port}/);
});


const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Create a connection pool for the MySQL database
const db = mysql.createPool({
    host: 'localhost',        // Replace with your database host, e.g., '127.0.0.1'
    user: 'your_username',    // Replace with your MySQL username
    password: 'your_password', // Replace with your MySQL password
    database: 'SignInDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connect to the database to verify the connection
db.getConnection((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit the process if connection fails
    }
    console.log('Connected to the MySQL database');
});

// Route to sign up a new user
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            db.query(
                'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                (err, results) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.status(201).json({ message: 'User created successfully' });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to sign in a user
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = results[0];

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Sign-in successful', user });
    });
});

// Route to get messages for a user
app.get('/messages/:userId', (req, res) => {
    const userId = req.params.userId;

    db.query('SELECT * FROM Messages WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ messages: results });
    });
});

// Route to post a message
app.post('/messages', (req, res) => {
    const { userId, message } = req.body;

    db.query(
        'INSERT INTO Messages (user_id, message) VALUES (?, ?)',
        [userId, message],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'Message sent successfully' });
        }
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(Server running on http://localhost:${PORT});
});