const express = require('express');
const router = express.Router();
const { verifyToken, hasPermission } = require('../auth/authMiddleware');
const roleController = require('../controllers/role.controller');

// Create a new role
router.post('/', verifyToken, hasPermission('roles:create'), roleController.createRole);

// Get all roles
router.get('/', verifyToken, hasPermission('roles:read'), roleController.getAllRoles);

// Get a single role by ID
router.get('/:roleId', verifyToken, hasPermission('roles:read'), roleController.getRoleById);

// Update a role
router.put('/:roleId', verifyToken, hasPermission('roles:update'), roleController.updateRole);

// Delete a role
router.delete('/:roleId', verifyToken, hasPermission('roles:delete'), roleController.deleteRole);

module.exports = router;