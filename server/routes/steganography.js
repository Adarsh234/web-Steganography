const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Image'); // Ensure this points to your Image model

const router = express.Router();

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage to keep original extensions and unique timestamps
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname).toLowerCase() || '.png';
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, WEBP) are permitted.'));
    }
  },
});

// Middleware to verify username header
const verifyUser = (req, res, next) => {
  const username = req.headers['username'];
  if (!username) {
    return res.status(401).json({ msg: 'Unauthorized: Missing username identifier in headers.' });
  }
  req.username = username;
  next();
};

/**
 * POST /steganography/encode
 * Archives an encoded carrier image into the user's vault
 */
router.post('/encode', verifyUser, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No carrier image received.' });
  }

  try {
    const newImage = new Image({
      username: req.username,
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    await newImage.save();

    res.status(201).json({
      msg: 'Image saved to vault successfully',
      image: {
        id: newImage._id,
        filename: newImage.filename,
        url: newImage.filepath,
      },
    });
  } catch (err) {
    console.error('Database write error:', err);
    res.status(500).json({ msg: 'Failed to archive image metadata.' });
  }
});

/**
 * GET /steganography/user-images
 * Retrieves all vault carriers uploaded by the current user
 */
router.get('/user-images', verifyUser, async (req, res) => {
  try {
    const images = await Image.find({ username: req.username }).sort({ createdAt: -1 });
    res.status(200).json({ images });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ msg: 'Failed to load user vault.' });
  }
});
/**
 * DELETE /steganography/image/:id
 * Removes a carrier record from MongoDB and deletes the physical file from disk
 */
router.delete('/image/:id', verifyUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the image exists and belongs to the authenticated user
    const image = await Image.findOne({ _id: id, username: req.username });
    if (!image) {
      return res.status(404).json({ msg: 'Carrier image not found or unauthorized.' });
    }

    // Construct the full disk path to the file
    const absolutePath = path.join(__dirname, '..', image.filepath);

    // Delete the file from the filesystem if it exists
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    // Remove the database record
    await Image.findByIdAndDelete(id);

    return res.status(200).json({ msg: 'Carrier image removed from vault successfully.' });
  } catch (err) {
    console.error('Deletion error:', err);
    return res.status(500).json({ msg: 'Failed to delete carrier image.' });
  }
});

module.exports = router;