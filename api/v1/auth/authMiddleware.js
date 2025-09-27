
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { ApiResponse } = require('../apiResponses');

// This middleware checks for a valid JWT and attaches the user and their permissions to the request object
const protect = (db) => async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) }, { projection: { password: 0 } });

            if (!user) {
                return res.status(401).json(new ApiResponse(401, null, 'Not authorized, user not found'));
            }

            // Fetch user's roles and permissions
            const rolesCollection = db.collection('roles');
            const userRoles = await rolesCollection.find({ _id: { $in: user.roles.map(id => new ObjectId(id)) } }).toArray();

            let permissions = new Set();
            userRoles.forEach(role => {
                role.permissions.forEach(permission => permissions.add(permission));
            });

            req.user = user;
            req.permissions = permissions;

            next();
        } catch (error) {
            res.status(401).json(new ApiResponse(401, null, 'Not authorized, token failed'));
        }
    }

    if (!token) {
        return res.status(401).json(new ApiResponse(401, null, 'Not authorized, no token'));
    }
};

// This middleware checks if the user has a specific permission
const hasPermission = (permission) => (req, res, next) => {
    if (!req.permissions || !req.permissions.has(permission)) {
        return res.status(403).json(new ApiResponse(403, null, 'Forbidden: You do not have the required permission'));
    }
    next();
};

module.exports = { protect, hasPermission };
