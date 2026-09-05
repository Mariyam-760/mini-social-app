const multer = require('multer');

// Render's filesystem is ephemeral (files vanish on every redeploy/restart/scale
// event), so images are NOT written to disk. Instead we keep the file in memory
// just long enough to convert it to a base64 data URI, which is then stored
// directly on the Post document in MongoDB Atlas. This keeps storage to exactly
// the two required collections (users, posts) with no third-party file service,
// and it works identically in local dev and in production.
const storage = multer.memoryStorage();

const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, png, jpg, webp, gif) are allowed'), false);
  }
};

// Kept deliberately small: base64 encoding adds ~33% overhead, and MongoDB has
// a 16MB per-document hard limit. 3MB raw -> ~4MB encoded, leaving headroom.
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_IMAGE_BYTES },
});

// Converts a multer memory file into a data URI string ready to store on a Post.
const fileToDataUri = (file) => {
  if (!file) return null;
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

module.exports = upload;
module.exports.fileToDataUri = fileToDataUri;
module.exports.MAX_IMAGE_BYTES = MAX_IMAGE_BYTES;
