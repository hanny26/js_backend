// user.routes.js
const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/user.controller.js');
const upload = require('../middlewares/multer.middleware.js');

router.post('/register',upload.fields([
  {
    name: 'avatar', 
    maxCount: 1
  },
  {
    name: 'cover', 
    maxCount: 1
  }
]),
 registerUser);

module.exports = router;


//fields ek hi field me diff array , and  array me multiple files upload krne ke liye, single file upload krne ke liye single array me daal denge