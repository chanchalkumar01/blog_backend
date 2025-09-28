const express = require('express');
const router = express.Router();
const { verifyToken, hasPermission } = require('../auth/authMiddleware');
const userController = require('../controllers/user.controller');

// Register a new user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.loginUser);

// Assign roles to a user
router.put('/:userId/roles', verifyToken, hasPermission('users:assign_roles'), userController.assignRoles);

// Get all users
router.get('/', verifyToken, hasPermission('users:read'), userController.getAllUsers);

// Get a single user by userId
router.get('/:userId', verifyToken, hasPermission('users:read'), userController.getUserById);

// Delete a user
router.delete('/:userId', verifyToken, hasPermission('users:delete'), userController.deleteUser);

module.exports = router;
