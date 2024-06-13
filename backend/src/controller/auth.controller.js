const express = require('express');
const User = require('../model/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const {
  hashPassword,
  verifyPassword,
  generateToken,
} = require('../utils/authUtils');

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, 'All Fields are required');
  }
  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExist) {
    throw new ApiError(400, 'User already exist');
  }
  const hashedPassword = hashPassword(password);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log('==========USER_CREATED================');
  console.log('newUserID:', newUser._id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Successfully created user'));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    throw new ApiError(400, 'All fields are required');
  }
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    throw new ApiError(400, 'Invalid email or password. aka(no user found)');
  }
  const isValidPassword = verifyPassword(password, foundUser.password);
  if (!isValidPassword) {
    throw new ApiError(
      400,
      'Invalid email or password. aka(password incorrect)'
    );
  }

  const payload = {
    _id: foundUser._id,
  };
  const token = generateToken(payload);
  foundUser.password = undefined;
  console.log('==========SUCCESS LOGIN================');
  console.log('loggedInUserID:', foundUser._id);
  // console.log("token:", token);
  res
    .status(200)
    .json(
      new ApiResponse(200, { token, user: foundUser }, 'Successfully Logged In')
    );
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.currentUser = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user._doc }, 'Ok'));
};

exports.updateProfile = async (req, res) => {
  const { username, bio } = req.body;
  console.log({ username, bio });
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username,
        bio,
      },
    },
    { new: true }
  );
  updatedUser.password = undefined;
  updatedUser.__v = undefined;
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        'successfully updated profile'
      )
    );
};
