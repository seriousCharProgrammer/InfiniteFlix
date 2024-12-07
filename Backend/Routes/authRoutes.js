const express = require('express');
const { login, register, logout } = require('../Controllers/authControllers');
const { protect } = require('../Middlewares/authMiddleware');
const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/logout').get(protect, logout);
module.exports = router;
