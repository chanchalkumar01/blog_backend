const express = require('express');
const router = express.Router();
const { verifyToken, hasPermission } = require('../auth/authMiddleware');
const blogController = require('../controllers/blog.controller');

// Create a new blog
router.post('/', verifyToken, hasPermission('blogs:create'), blogController.createBlog);

// Get all blogs
router.get('/', blogController.getAllBlogs);

// Get a single blog by blogId or slug
router.get('/:identifier', verifyToken, blogController.getBlogByIdentifier);

// Update a blog
router.put('/:blogId', verifyToken, hasPermission('blogs:update'), blogController.updateBlog);

// Delete a blog
router.delete('/:blogId', verifyToken, hasPermission('blogs:delete'), blogController.deleteBlog);

// Like a blog
router.put('/:blogId/like', verifyToken, blogController.likeBlog);

// Add a comment to a blog
router.post('/:blogId/comments', verifyToken, blogController.addComment);

// Update comment status
router.put('/:blogId/comments/:commentId/status', verifyToken, hasPermission('comments:manage'), blogController.updateCommentStatus);

module.exports = router;