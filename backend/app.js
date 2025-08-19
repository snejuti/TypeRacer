const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User.js');
const LeaderboardEntry = require('./models/LeaderboardEntry.js');
const connectDB = require("./src/config/db.config.js");
const app = express();
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
};

connectDB(); // Call the database connection
app.use(cors(corsOptions));
// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  console.log('Signup request body:', req.body); // Log incoming data
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required.' });
  }
  try {
    const exists = await User.findOne({ email });
    console.log('User.findOne result:', exists); // Log result
    if (exists) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    const user = new User({ name, email, password }); // Hash password in production!
    await user.save();
    console.log('User saved:', user); // Log saved user
    res.json({ message: 'Signup successful.' });
  } catch (err) {
    console.error('Signup error:', err.message); // Log full error object
    console.error('Signup error stack:', err.stack);
    // Return the actual error message and stack for debugging
    res.status(500).json({ 
      message: 'Server error.', 
      error: err.message, 
      stack: err.stack, 
      details: err 
    });
  }
});

// ✅ Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Profile
app.get('/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }, 'name email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ profile: user });
  } catch (err) {
    res.status(500).json({ message: 'Fetch profile error', error: err.message });
  }
});


app.get("/", (req, res) => {
  res.send("Welcome to the Typing Speed Test API");
});

// Leaderboard endpoints
app.get('/api/leaderboard', async (req, res) => {
  try {
    const entries = await LeaderboardEntry.find().sort({ wpm: -1 }).limit(10);
    res.json(entries);
  } catch (err) {
    console.error('Leaderboard fetch error:', err.stack); // Log full error stack
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

app.post('/api/leaderboard', async (req, res) => {
  console.log('Leaderboard POST body:', req.body); // Log incoming data
  const { name, wpm, accuracy } = req.body;
  if (!name || wpm === undefined || accuracy === undefined) {
    return res.status(400).json({ message: 'All fields required.' });
  }
  // Validate numeric fields
  if (isNaN(Number(wpm)) || isNaN(Number(accuracy))) {
    return res.status(400).json({ message: 'wpm and accuracy must be numbers.' });
  }
  try {
    const entry = new LeaderboardEntry({ name, wpm: Number(wpm), accuracy: Number(accuracy) });
    await entry.save();
    res.json({ message: 'Score submitted.' });
  } catch (err) {
    console.error('Leaderboard save error:', err); // Log full error object
    console.error('Leaderboard save error stack:', err.stack);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))



