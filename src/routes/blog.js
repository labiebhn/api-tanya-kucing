const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const blogController = require('../controllers/blog');

// POST
router.post('/post', [
  body('title').isLength({min: 5}).withMessage('Input title tidak sesuai'),
  body('body').isLength({min: 5}).withMessage('Input body tidak sesuai')],
  blogController.addBlog);

// GET
router.get('/posts', blogController.getBlog);
router.get('/post/:postId', blogController.getBlogById);

// UPDATE
router.put('/post/:postId', [
  body('title').isLength({min: 5}).withMessage('Input title tidak sesuai'),
  body('body').isLength({min: 5}).withMessage('Input body tidak sesuai')],
  blogController.updateBlog);

// DELETE
router.delete('/post/:postId', blogController.deleteBlog);

module.exports = router;