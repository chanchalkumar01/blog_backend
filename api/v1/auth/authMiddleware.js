const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { ApiResponse } = require('../apiResponses');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json(new ApiResponse(403, null, 'A token is required for authentication'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json(new ApiResponse(401, null, 'Invalid Token'));
    }

    return next();
};

const hasPermission = (permission) => async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('roles');
        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        const permissions = new Set();
        for (const role of user.roles) {
            for (const p of role.permissions) {
                permissions.add(p);
            }
        }

        if (!permissions.has(permission)) {
            return res.status(403).json(new ApiResponse(403, null, 'You do not have permission to perform this action'));
        }

        req.permissions = permissions;
        next();
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { error: error.message }, 'Error checking permissions'));
    }
};

module.exports = { verifyToken, hasPermission };
