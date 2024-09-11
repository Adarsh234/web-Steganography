const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).json({ msg: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ msg: 'Failed to authenticate token' });
        req.userId = decoded.userId;
        next();
    });
};

// Encode Message into Image
router.post('/encode', [verifyToken, upload.single('image')], (req, res) => {
    // Handle image encoding here
    res.json({ msg: 'Image encoded successfully' });
});

// Decode Message from Image
router.post('/decode', [verifyToken, upload.single('image')], (req, res) => {
    // Handle image decoding here
    res.json({ msg: 'Message decoded successfully' });
});

module.exports = router;
