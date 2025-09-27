const { ObjectId } = require('mongodb');
const { ApiResponse } = require('../apiResponses');
const roleSchema = require('../models/role.model');

const COLLECTION_NAME = 'roles';

exports.createRole = async (req, res) => {
    try {
        const db = req.app.get('db');
        const { error, value } = roleSchema.validate(req.body);
        if (error) {
            return res.status(400).json(new ApiResponse(400, error.details, 'Invalid role data'));
        }

        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.insertOne(value);
        const createdRole = await collection.findOne({ _id: result.insertedId });

        res.status(201).json(new ApiResponse(201, createdRole, 'Role created successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error creating role'));
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const db = req.app.get('db');
        const collection = db.collection(COLLECTION_NAME);
        const roles = await collection.find({}).toArray();
        res.status(200).json(new ApiResponse(200, roles, 'Roles fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error fetching roles'));
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const db = req.app.get('db');
        const collection = db.collection(COLLECTION_NAME);
        const role = await collection.findOne({ _id: new ObjectId(req.params.id) });

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
        const db = req.app.get('db');
        const { error, value } = roleSchema.validate(req.body);
        if (error) {
            return res.status(400).json(new ApiResponse(400, error.details, 'Invalid role data'));
        }

        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: value }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, 'Role not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Role updated successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error updating role'));
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const db = req.app.get('db');
        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, 'Role not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Role deleted successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error deleting role'));
    }
};