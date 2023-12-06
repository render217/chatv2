const express = require('express');
const router = express.Router();
const {
  currentUser,
  loginUser,
  registerUser,
  updateProfile,
} = require('../controller/auth.controller');
const { checkAuth } = require('../middleware/checkAuth');
//
router.route('/login').post(loginUser);
router.route('/register').post(registerUser);

// get logged in user
router.route('/currentuser').get(checkAuth, currentUser);
router.route('/update').patch(checkAuth, updateProfile);
module.exports = router;
