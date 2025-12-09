//middlewares/upload.js
const multer = require('multer');

// Use memory storage – file will be in req.file.buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024, files: 8 },
  fileFilter: (_request, file, cb) => {
    const mt = (file.mimetype || '').toLowerCase();

    const ok =
      mt === 'image/png' ||
      mt === 'image/jpeg' ||
      mt === 'image/jpg' ||
      mt === 'image/webp' ||
      mt === 'image/gif' ||
      mt === 'image/heic' ||
      mt === 'image/heif' ||
      mt === 'image/x-adobe-dng' ||
      mt === 'image/dng';

    if (!ok) {
      console.log('⛔ blocked upload, mimetype was:', file.mimetype);
      return cb(
        new Error('Only image files are allowed (png,jpg,webp,gif,heic,heif,dng)')
      );
    }

    cb(null, true);
  },
});

module.exports = upload;


