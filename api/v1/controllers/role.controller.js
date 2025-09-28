const { ApiResponse } = require('../apiResponses');
const Role = require('../models/role.model');

exports.createRole = async (req, res) => {
    try {
        const newRole = new Role(req.body);
        const savedRole = await newRole.save();
        res.status(201).json(new ApiResponse(201, savedRole, 'Role created successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error creating role'));
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.status(200).json(new ApiResponse(200, roles, 'Roles fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error fetching roles'));
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json(new ApiResponse(404, null, 'Role not found'));
        }

        res.status(200).json(new ApiResponse(200, role, 'Role fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error fetching role'));
    }
};

exports.updateRole = async (req, res) => {
    try {
        const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedRole) {
            return res.status(404).json(new ApiResponse(404, null, 'Role not found'));
        }

        res.status(200).json(new ApiResponse(200, updatedRole, 'Role updated successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error updating role'));
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);

        if (!deletedRole) {
            return res.status(404).json(new ApiResponse(404, null, 'Role not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Role deleted successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error deleting role'));
    }
};