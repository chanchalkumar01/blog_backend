const express = require('express');
const router = express.Router();
const { protect, hasPermission } = require('../auth/authMiddleware');
const blogController = require('../controllers/blog.controller');

module.exports = function(db) {
    // Create a new blog
    router.post('/', protect(db), hasPermission('blogs:create'), blogController.createBlog);

    // Get all blogs
    router.get('/', blogController.getAllBlogs);

    // Get a single blog by blogId or slug
    router.get('/:identifier', protect(db), blogController.getBlogByIdentifier);

    // Update a blog
    router.put('/:blogId', protect(db), hasPermission('blogs:update'), blogController.updateBlog);

    // Delete a blog
    router.delete('/:blogId', protect(db), hasPermission('blogs:delete'), blogController.deleteBlog);

    // Like a blog
    router.put('/:blogId/like', blogController.likeBlog);

    // Add a comment to a blog
    router.post('/:blogId/comments', protect(db), blogController.addComment);

    // Update comment status
    router.put('/:blogId/comments/:commentId/status', protect(db), hasPermission('comments:manage'), blogController.updateCommentStatus);

    return router;
}