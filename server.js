// MongoDB set-up
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Server.js set up
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


//Parse JSON to form data
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Connect files
app.use(express.static('public'));

const User = require('./models/User');
// ROUTES

//POST route to create user
app.post('/users', async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = new User({email, password });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// Authenticates the user
const bcrypt = require('bcrypt');

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
      // If login is successful
      res.status(200).json({
          message: 'Login successful',
          _id: user._id,
          username: user.username
      });
  } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
  
});


  // Listen
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });