const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();


// User Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }
  
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      console.log('User exsist');
      return res.status(400).json({ message: 'Username already exists' });
    }
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username:  username,
      email:  email,
      password: hashedPassword,  // Store hashed password
    });

    await newUser.save();
    console.log('User registered successfully');
    alert("user login successfull")
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  console.log("Login route hit")
    const { username, password } = req.body;

  console.log("Request body:", req.body)
  
    try {
      // Check if user exists
      const user = await User.findOne({ username });
      console.log('User found:', user);

      if (!user) {
        console.log("User not found")
        return res.status(400).json({ message: 'User not found' });
      }

      try {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
  
        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
        }

        res.status(200).json({ msg: 'Login successful' });
      } catch (passwordError) {
        console.error('Password comparison error:', passwordError);
        return res.status(500).json({ msg: 'Password comparison failed' });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Server error' });
    }
  });

module.exports = router;
