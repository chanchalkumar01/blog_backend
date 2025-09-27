const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const userSchema = require('../models/user.model');
const { ApiResponse } = require('../apiResponses');

const COLLECTION_NAME = 'users';

async function getNextSequenceValue(db, sequenceName) {
    const sequenceDocument = await db.collection('counters').findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true }
    );
    return sequenceDocument.seq;
}

exports.registerUser = async (req, res) => {
    try {
        const db = req.app.get('db');
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json(new ApiResponse(400, error.details, 'Invalid user data'));
        }

        const collection = db.collection(COLLECTION_NAME);
        const existingUser = await collection.findOne({ $or: [{ email: value.email }, { username: value.username }] });
        if (existingUser) {
            return res.status(409).json(new ApiResponse(409, null, 'Username or email already exists'));
        }

        const hashedPassword = await bcrypt.hash(value.password, 10);
        const userId = await getNextSequenceValue(db, 'userId');

        const newUser = {
            userId: userId,
            username: value.username,
            email: value.email,
            password: hashedPassword,
            roles: [], // Roles are assigned separately
            createdAt: new Date()
        };

        const result = await collection.insertOne(newUser);
        const createdUser = await collection.findOne({_id: result.insertedId}, { projection: { password: 0 } });

        res.status(201).json(new ApiResponse(201, createdUser, 'User registered successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error creating user'));
    }
};

exports.loginUser = async (req, res) => {
    try {
        const db = req.app.get('db');
        const { email, password } = req.body;
        const collection = db.collection(COLLECTION_NAME);
        const user = await collection.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d', // Token expires in 1 day
            });
            res.status(200).json(new ApiResponse(200, { token }, 'Login successful'));
        } else {
            res.status(401).json(new ApiResponse(401, null, 'Invalid credentials'));
        }
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error logging in'));
    }
};

exports.assignRoles = async (req, res) => {
    try {
        const db = req.app.get('db');
        const { roles } = req.body; // Expecting an array of role IDs
        if (!Array.isArray(roles)) {
            return res.status(400).json(new ApiResponse(400, null, 'Roles must be an array of role IDs'));
        }

        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.updateOne(
            { userId: parseInt(req.params.userId) },
            { $set: { roles: roles } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'User roles updated successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error updating user roles'));
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const db = req.app.get('db');
        const collection = db.collection(COLLECTION_NAME);
        const users = await collection.find({}, { projection: { password: 0 } }).toArray();
        res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error fetching users'));
    }
};

exports.getUserById = async (req, res) => {
    try {
        const db = req.app.get('db');
        const collection = db.collection(COLLECTION_NAME);
        const user = await collection.findOne(
            { userId: parseInt(req.params.userId) },
            { projection: { password: 0 } } 
        );

        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error fetching user'));
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const db = req.app.get('db');
        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.deleteOne({ userId: parseInt(req.params.userId) });

        if (result.deletedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error deleting user'));
    }
};