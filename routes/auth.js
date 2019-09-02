const express = require('express');
const authController = require('../controllers/auth.js');
const isAuth = require('../middleware/isAuth.js');

const router = express.Router();

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignUp);

module.exports = router;
