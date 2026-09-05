const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    trim: true,
    default: '',
  },
  image: {
    type: String,
    default: null,
  },
  likes: {
    type: [likeSchema],
    default: [],
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
