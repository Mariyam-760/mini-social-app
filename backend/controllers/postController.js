const mongoose = require('mongoose');
const Post = require('../models/Post');
const { fileToDataUri } = require('../config/upload');

// GET /api/posts
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    const formatted = posts.map((p) => ({
      _id: p._id,
      userId: p.userId,
      username: p.username,
      text: p.text,
      image: p.image,
      likesCount: p.likes.length,
      likes: p.likes,
      commentsCount: p.comments.length,
      comments: p.comments,
      createdAt: p.createdAt,
    }));

    return res.status(200).json({ posts: formatted });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    const trimmedText = text ? text.trim() : '';
    const imagePath = req.file ? fileToDataUri(req.file) : null;

    if (!trimmedText && !imagePath) {
      return res.status(400).json({ message: 'Post must contain text or an image' });
    }

    const post = await Post.create({
      userId: req.user.id,
      username: req.user.username,
      text: trimmedText,
      image: imagePath,
      likes: [],
      comments: [],
    });

    return res.status(201).json({
      post: {
        _id: post._id,
        userId: post.userId,
        username: post.username,
        text: post.text,
        image: post.image,
        likesCount: 0,
        likes: [],
        commentsCount: 0,
        comments: [],
        createdAt: post.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/:id/like  (toggle like/unlike)
const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    const existingIndex = post.likes.findIndex((l) => l.userId.toString() === userId);

    let liked;
    if (existingIndex >= 0) {
      post.likes.splice(existingIndex, 1);
      liked = false;
    } else {
      post.likes.push({ userId, username: req.user.username });
      liked = true;
    }

    await post.save();

    return res.status(200).json({
      liked,
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/:id/comment
const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      userId: req.user.id,
      username: req.user.username,
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    return res.status(201).json({
      commentsCount: post.comments.length,
      comments: post.comments,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPosts, createPost, toggleLike, addComment };
