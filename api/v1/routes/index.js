const express = require('express');
const router = express.Router();

module.exports = function (db) {
    const blogRoutes = require('./blog.routes')(db);
    const userRoutes = require('./user.routes')(db);
    const roleRoutes = require('./role.routes')(db);

    router.use('/blogs', blogRoutes);
    router.use('/users', userRoutes);
    router.use('/roles', roleRoutes);

    return router;
};