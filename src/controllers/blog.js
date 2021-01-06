const { validationResult } = require('express-validator');
const BlogPost = require('../models/blog');

exports.addBlog = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Input Value Tidak Sesuai');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error('Image harus diupload');
    err.errorStatus = 422;
    throw err;
  }

  const { title, body } = req.body;
  const image = req.file.path;

  const Posting = new BlogPost({
    title: title,
    body: body,
    image: image,
    author: {
      uid: 1,
      name: 'Labieb Hammam Nurri'
    }
  });

  Posting.save()
  .then(result => {
    res.status(201).json({
      message: 'Create blog post success.',
      data: result
    });
  })
  .catch(err  => console.log('error: ', err));
}