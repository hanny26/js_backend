// const { Router } = require('express');
const { Router } = require('express');
const router = Router();
const { registerUser } = require('../controllers/user.controller');
// const router = Router();

router.route("/register").post(registerUser);

module.exports = router;
// import { Router } from 'express';
// const router = Router();