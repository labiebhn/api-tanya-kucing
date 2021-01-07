// PACKAGE/LIBRARY
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');

// STORAGE IMAGE
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); //PATH TO SAVE IMAGE : root/images/
  },
  filename: (req, file, callback) => {
    callback(null, new Date().getTime() + '-' + file.originalname); //NAME IMAGE : root/images/<filename>
  }
})  

// FILTER TYPE OF FILES
const fileFilter = (req, file, callback) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

// SHORTCUT FOR GET BODY ON REQUEST CILENT
app.use(bodyParser.json());
// MAKE URL STATIC FOR ALLOWING CILENT ACCESS DIRECTORY PATH IMAGES
app.use('/images', express.static(path.join(__dirname /* PATH FILE index.js */, 'images' /* FOLDER IMAGES */)));
// CATCHING & SAVE FILE FROM MULTIPART FORM DATA
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image' /* KEY */));

// ALLOWING CILENT FOR ACCESSING API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ROUTES
app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);

// HANDLING ERROR
app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({message: message, data: data});
});

// CONNECT DATABASE MONGODB
mongoose.connect('mongodb+srv://labiebhn:LBEyMaxWu8aHyvwd@cluster0.8wb86.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => {
  app.listen(4000, () => console.log('Connection Success')); //IF SUCESSED SERVER WILL BE MOUNTED
})
.catch(err => console.log(err));