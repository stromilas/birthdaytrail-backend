const express = require('express');
const isAuth = require('../middleware/isAuth.js');
const birthdayController = require('../controllers/birthday.js');

const router = express.Router();

router.get('/birthdays', isAuth, birthdayController.getBirthdays);
router.post('/birthdays', isAuth, birthdayController.postBirthdays);
router.patch('/birthdays', isAuth, birthdayController.patchBirthdays);
router.delete('/birthdays', isAuth, birthdayController.deleteBirthdays);

module.exports = router;
