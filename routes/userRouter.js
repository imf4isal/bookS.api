const express = require('express');

const userControllers = require('./../controllers/userControllers');
const authControllers = require('./../controllers/authController');

const router = express.Router();

// signup - login
router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);

// password
router.post('/forgotPassword', authControllers.forgotPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);

router.patch(
  '/updatePassword',
  authControllers.protect,
  authControllers.updatePassword
);

// self account activity
router.get(
  '/me',
  authControllers.protect,
  userControllers.getMe,
  userControllers.getUser
);
router.patch('/updateMe', authControllers.protect, userControllers.updateMe);
router.delete('/deleteMe', authControllers.protect, userControllers.deleteMe);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
