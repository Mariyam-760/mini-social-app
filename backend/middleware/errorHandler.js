const multer = require('multer');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image file is too large. Max size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err && err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'A user with this email already exists' });
  }

  return res.status(err.status || 500).json({ message: err.message || 'Server error' });
};

module.exports = errorHandler;
