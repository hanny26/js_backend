// // const { Router } = require('express');
// const express = require('express');
// const router = express.Router();
// const { registerUser }= require('../controllers/user.controller.js');
// // const router = Router();

// router.route("/register").post(registerUser);
// // router.post("/register", registerUser.register);

// module.exports = router;
// // import { Router } from 'express';
// // const router = Router();

const express = require('express');
const router = express.Router();

const { registerUser } = require('../controllers/user.controller.js'); // Import the registerUser function

// Define a route for registering a user
router.post('/register', registerUser);

module.exports = router;

