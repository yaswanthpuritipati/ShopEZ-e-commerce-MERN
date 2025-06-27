const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
// Multer setup for image uploads
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
  }
});
const upload = multer({ storage });

// Get current banner
router.get('/', async (req, res) => {
  const banner = await Banner.findOne();
  res.json(banner || { url: '' });
});

// Update banner (replace or create) with image upload
router.put('/', upload.single('image'), async (req, res) => {
  let url = req.body.url;
  if (req.file) {
    url = '/uploads/' + req.file.filename;
  }
  let banner = await Banner.findOne();
  if (banner) {
    banner.url = url;
    await banner.save();
  } else {
    banner = new Banner({ url });
    await banner.save();
  }
  res.json(banner);
});

module.exports = router; 