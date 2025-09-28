
const Role = require('../models/role.model');
const { ApiResponse } = require('../apiResponses');

exports.createRole = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json(new ApiResponse(403, null, 'Forbidden: Only admins can create roles'));
        }
        const { name, permissions } = req.body;
        const newRole = new Role({ name, permissions });
        const savedRole = await newRole.save();
        res.status(201).json(new ApiResponse(201, savedRole, 'Role created successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error creating role'));
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(new ApiResponse(200, roles, 'Roles fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error fetching roles'));
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.roleId);
        if (!role) {
            return res.status(404).json(new ApiResponse(404, null, 'Role not found'));
        }
        res.status(200).json(new ApiResponse(200, role, 'Role fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error fetching role'));
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.roleId,
            { name, permissions },
            { new: true }
        );
        if (!updatedRole) {
            return res.status(404).json(new ApiResponse(404, null, 'Role not found'));
        }
        res.status(200).json(new ApiResponse(200, updatedRole, 'Role updated successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error updating role'));
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.roleId);
        if (!deletedRole) {
            return res.status(404).json(new ApiResponse(404, null, 'Role not found'));
        }
        res.status(200).json(new ApiResponse(200, null, 'Role deleted successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error deleting role'));
    }
};
