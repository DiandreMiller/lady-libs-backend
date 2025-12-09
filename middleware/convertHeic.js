// middlewares/convertHeic.js
const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');

module.exports = async function convertHeic(request, _response, next) {
  try {
    const file = request.file;
    console.log('HEIC middleware');

    // No file? move on
    if (!file) return next();

    // Check common HEIC/HEIF variants
    const looksHeic =
      /^image\/hei[cf]/i.test(file.mimetype) ||
      file.originalname?.toLowerCase().endsWith('.heic') ||
      file.originalname?.toLowerCase().endsWith('.heif');

    if (!looksHeic) return next();

    // Perform conversion
    const inputBuffer = fs.readFileSync(file.path);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9,
    });

    // Write to new .jpg file
    const parsed = path.parse(file.path);
    const jpgPath = path.join(parsed.dir, parsed.name + '.jpg');
    fs.writeFileSync(jpgPath, outputBuffer);

    // Update req.file to point to the new file
    file.path = jpgPath;
    file.filename = path.basename(jpgPath);
    file.mimetype = 'image/jpeg';
    file.originalname = file.originalname.replace(/\.(heic|heif)$/i, '.jpg');

    console.log(`✅ Converted HEIC to JPEG: ${file.originalname}`);

    next();
  } catch (error) {
    console.error('HEIC conversion error:', error);
    next(); // Don’t break the request — just continue
  }
};


