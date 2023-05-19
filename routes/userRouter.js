const express = require('express');

const userControllers = require('./../controllers/userControllers');
const authControllers = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authControllers.createUser);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
router
  .route('/')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
