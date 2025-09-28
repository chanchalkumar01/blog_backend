const express = require('express');
const router = express.Router();
const { protect, hasPermission } = require('../auth/authMiddleware');
const blogController = require('../controllers/blog.controller');

// Create a new blog
router.post('/', protect, hasPermission('blogs:create'), blogController.createBlog);

// Get all blogs
router.get('/', blogController.getAllBlogs);

// Get a single blog by blogId or slug
router.get('/:identifier', protect, blogController.getBlogByIdentifier);

// Update a blog
router.put('/:blogId', protect, hasPermission('blogs:update'), blogController.updateBlog);

// Delete a blog
router.delete('/:blogId', protect, hasPermission('blogs:delete'), blogController.deleteBlog);

// Like a blog
router.put('/:blogId/like', blogController.likeBlog);

// Add a comment to a blog
router.post('/:blogId/comments', protect, blogController.addComment);

// Update comment status
router.put('/:blogId/comments/:commentId/status', protect, hasPermission('comments:manage'), blogController.updateCommentStatus);

module.exports = router;