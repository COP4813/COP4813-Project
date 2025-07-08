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

const session = require('express-session');
// Session middleware
app.use(session({
  secret: 'yourSecretKey', // replace with env var in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // secure: true if using HTTPS
}));

// Connect files
app.use(express.static('public'));

const path = require('path');
app.get('/admin.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '/admin.html'));
});
const User = require('./models/User');

function isAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.email === 'admin@gmail.com') {
    return next();
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

app.get('/check-auth', (req, res) => {
  if (req.session.user && req.session.user.email === 'admin@gmail.com') {
    return res.sendStatus(200); // OK
  } else {
    return res.sendStatus(401); // Unauthorized
  }
});

// ROUTES
// GET route to fetch users 
app.get('/users', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find({}, 'email'); // get email and username (adjust fields as needed)
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

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

// DELETE route for users
app.delete('/users/:id', isAuthenticated, async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
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

      req.session.user = {
      _id: user._id,
      email: user.email
    };
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