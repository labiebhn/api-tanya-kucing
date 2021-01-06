const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const blogController = require('../controllers/blog');

router.post('/post', [
  body('title').isLength({min: 5}).withMessage('Input title tidak sesuai'),
  body('body').isLength({min: 5}).withMessage('Input body tidak sesuai')],
  blogController.addBlog
);

module.exports = router;