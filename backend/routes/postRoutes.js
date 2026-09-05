const express = require('express');
const { getPosts, createPost, toggleLike, addComment } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../config/upload');

const router = express.Router();

router.get('/', getPosts);
router.post('/', protect, upload.single('image'), createPost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);

module.exports = router;
