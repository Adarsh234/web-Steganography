const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }
  
  try {
    // Check if either the username OR the email already exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    // Pass the raw password directly. 
    // The User schema's pre('save') hook will hash it automatically.
    const newUser = new User({
      username: username,
      email: email,
      password: password, 
    });

    await newUser.save();
    console.log('User registered successfully');
    
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use the custom comparePassword method from your User schema
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // TODO: Generate and return a JWT here for future authenticated requests
    res.status(200).json({ msg: 'Login successful' });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;