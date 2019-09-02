const express = require('express');
const isAuth = require('../middleware/isAuth.js');
const subscriptionController = require('../controllers/subscription.js');

const router = express.Router();

router.post('/subscribe', isAuth, subscriptionController.postSubscription);

module.exports = router;
