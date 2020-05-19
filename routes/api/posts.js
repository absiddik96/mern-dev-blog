const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../../models/User');
const Post = require('../../models/Post');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }).populate('user', ['name', 'avatar']);
    return res.json(posts);
  } catch (e) {
    return res.status(500).json({ error: "Server Error" });
  }
});

router.get('/:id', [checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', ['name', 'avatar']);
    return res.json(post);
  } catch (e) {
    return res.status(500).json({ error: "Server Error" });
  }
});

const postValidation = [
  check('text', 'Text is required').not().isEmpty()
];

router.post('/', [auth, postValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    const post = new Post({
      text: req.body.text,
      user: req.user.id,
      name: user.name,
      avatar: user.avatar
    });
    
    await post.save();
    return res.json(post);
  } catch (e) {
    return res.status(500).json({ error: "Server Error" });
  }
});


router.put('/:id', [auth, checkObjectId('id'), postValidation], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    
    if (post.user.toString() !== req.user.id) {
      return res.status(400).json({ error: 'You are not authorized.' });
    }
    
    post.text = req.body.text;
    
    await post.save({ new: true });
    return res.json(post);
  } catch (e) {
    return res.status(500).json({ error: "Server Error" });
  }
});

router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    
    if (post.user.toString() !== req.user.id) {
      return res.status(400).json({ error: 'You are not authorized.' });
    }
    
    await post.delete();
    return res.json({ msg: 'Post removed' });
    
  } catch (e) {
    return res.status(500).json({ error: "Server Error" });
  }
});

router.post('/:id/like', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    
    const is_liked = await post.likes.find(like => like.user.toString() === req.user.id);
    if (is_liked) {
      return res.status(400).json({ error: 'Already liked this post' });
    }
    
    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.json(post.likes);
  } catch (e) {
    return res.status(500).json({ error: "Server Error" });
  }
});

router.post('/:id/unlike', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    
    const liked = await post.likes.find(like => like.user.toString() === req.user.id);
    if (!liked) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    
    const liked_index = post.likes.indexOf(liked);
    await post.likes.splice(liked_index, 1);
    await post.save();
    return res.json(post.likes);
  } catch (e) {
    return res.status(500).json({ error: "Server Error" });
  }
});

const commentValidation = [
  check('text', 'Text is required').not().isEmpty()
];

router.post('/:id/comment', [auth, commentValidation], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({error: 'Post not found.'});
    }
  
    post.comments.unshift({
      text: req.body.text,
      user: req.user.id,
      name: user.name,
      avatar: user.avatar
    });
    
    await post.save();
    return res.json(post.comments);
  } catch (e) {
    return res.status(500).json({ error: "Server Error" });
  }
});

router.put('/:id/comment/:comment_id', [auth, checkObjectId('id'), checkObjectId('comment_id'), commentValidation], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({error: 'Post not found.'});
    }
    
    // Add to comments array
    const comment = post.comments.id(req.params.comment_id);
    
    if (!comment) {
      return res.status(404).json({error: 'Comment not found.'});
    }
    
    if (comment.user.toString() !== req.user.id) {
      return res.status(400).json({error: 'You are not authorized.'});
    }
    
    comment.text =  req.body.text;
    
    // Save
    await post.save();
    res.json(post.comments);
  } catch (e) {
    return res.status(500).json({error: "Server Error"});
  }
});

router.delete('/:id/comment/:comment_id', [auth, checkObjectId('id'), checkObjectId('comment_id')], async (req, res) => {
  try {
    const post = await Post.findOne({_id: req.params.id})
    if (!post) {
      return res.status(404).json({error: 'Post not found.'});
    }
    
    const comment = await post.comments.id(req.params.comment_id);
    
    if (!comment) {
      return res.status(404).json({error: 'Comment not found.'});
    }
    
    if (comment.user.toString() !== req.user.id) {
      return res.status(400).json({error: 'You are not authorized.'});
    }
    
    const commentIndex = await post.comments.indexOf(comment);
    post.comments.splice(commentIndex, 1);
    
    // Save
    await post.save();
    res.json(post.comments);
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;