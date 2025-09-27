const express = require('express');
const router = express.Router();
const { protect, hasPermission } = require('../auth/authMiddleware');
const userController = require('../controllers/user.controller');

module.exports = function(db) {
    // Register a new user
    router.post('/register', userController.registerUser);

    // Login a user
    router.post('/login', userController.loginUser);

    // Assign roles to a user
    router.put('/:userId/roles', protect(db), hasPermission('users:assign_roles'), userController.assignRoles);

    // Get all users
    router.get('/', protect(db), hasPermission('users:read'), userController.getAllUsers);

    // Get a single user by userId
    router.get('/:userId', protect(db), hasPermission('users:read'), userController.getUserById);

    // Delete a user
    router.delete('/:userId', protect(db), hasPermission('users:delete'), userController.deleteUser);

    return router;
}