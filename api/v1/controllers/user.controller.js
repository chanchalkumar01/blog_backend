const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const { ApiResponse } = require('../apiResponses');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json(new ApiResponse(409, null, 'Username or email already exists'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let roleIds = [];
        if (roles && roles.length > 0) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            if (foundRoles.length !== roles.length) {
                return res.status(400).json(new ApiResponse(400, null, 'One or more roles not found'));
            }
            roleIds = foundRoles.map(role => role._id);
        }

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            roles: roleIds,
        });

        const savedUser = await newUser.save();
        savedUser.password = undefined;

        res.status(201).json(new ApiResponse(201, savedUser, 'User registered successfully'));
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json(new ApiResponse(400, error.errors, 'Invalid user data'));
        }
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error creating user'));
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });
            res.status(200).json(new ApiResponse(200, { token }, 'Login successful'));
        } else {
            res.status(401).json(new ApiResponse(401, null, 'Invalid credentials'));
        }
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error logging in'));
    }
};

exports.assignRoles = async (req, res) => {
    try {
        const { roles } = req.body;
        if (!Array.isArray(roles)) {
            return res.status(400).json(new ApiResponse(400, null, 'Roles must be an array of role IDs'));
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: { roles: roles } },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'User roles updated successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error updating user roles'));
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error fetching users'));
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');

        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error fetching user'));
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.userId);

        if (!result) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error deleting user'));
    }
};