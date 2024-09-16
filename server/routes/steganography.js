const express = require('express');
const multer = require('multer');

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Middleware to verify username from the headers
const verifyUser = (req, res, next) => {
    const username = req.headers['username']; // Fetch username from headers
    if (!username) {
        return res.status(403).json({ msg: 'No username provided' });
    }

    // Normally you'd verify the user in the database here
    req.username = username;
    next();
};

// Encode Message into Image
router.post('/encode', [verifyUser, upload.single('image')], (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Handle image encoding logic here
    console.log(`Encoding image for user: ${req.username}`);
    // Add image encoding logic

    res.json({ msg: 'Image encoded successfully' });
});

// Decode Message from Image
router.post('/decode', [verifyUser, upload.single('image')], (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Handle image decoding logic here
    console.log(`Decoding image for user: ${req.username}`);
    // Add image decoding logic

    res.json({ msg: 'Message decoded successfully' });
});

module.exports = router;
