const express = require('express');
const router = express.Router();

const blogRoutes = require('./blog.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');

router.use('/blogs', blogRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);

module.exports = router;
