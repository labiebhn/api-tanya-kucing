const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
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

exports.getBlog = (req, res, next) => {
  BlogPost.find().then(result => {
    res.status(200).json({
      message: 'Data Blog Post Berhasil Diambil',
      data: result
    })
  })
  .catch(err => next(err));
}

exports.getBlogById = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId).then(result => {
    if(!result) {
      const error = new Error('Blog Post Tidak Ditemukan');
      error.errorStatus = 404;
      throw error;
    } 
    res.status(200).json({
      message: 'Data Blog Post Berhasil Dipanggil',
      data: result
    })
  })
  .catch(err => next(err));
}

exports.updateBlog = (req, res, next) => {
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
  const postId = req.params.postId;

  BlogPost.findById(postId).then(post => {
    if(!post) {
      const error = new Error('Blog Post Tidak Ditemukan');
      error.errorStatus = 404;
      throw error;
    }

    post.title = title;
    post.body = body;
    post.image = image;

    return post.save();
  })
  .then(result => {
    res.status(200).json({
      message: "Update Success.",
      data: result
    })
  })
  .catch(err => next(err))
}

exports.deleteBlog = (req, res, next) => {
  const postId = req.params.postId;

  BlogPost.findById(postId)
  .then(post => {
    if(!post) {
      const error = new Error('Blog Post Tidak Ditemukan');
      error.errorStatus = 404;
      throw error;
    }

    removeImage(post.image);
    return BlogPost.findByIdAndRemove(postId)
  })
  .then(result => {
    res.status(200).json({
      message: 'Hapus Blog Post Berhasil',
      data: result
    })
  })
  .catch(err => next(err));
}

const removeImage = (filePath) => {
  filePath = path.join(__dirname, '../../', filePath);
  fs.unlink(filePath, err => console.log(err));
}