const Blog = require('../models/blog.model');
const sanitizeHtml = require('sanitize-html');
const { ApiResponse } = require('../apiResponses');
const slugify = require('../utils/slugify');

exports.createBlog = async (req, res) => {
    try {
        const { title, content, ...rest } = req.body;

        if (!title || !content) {
            return res.status(400).json(new ApiResponse(400, null, 'Title and content are required'));
        }

        const slug = slugify(title);
        const sanitizedContent = sanitizeHtml(content);

        const newBlog = new Blog({
            ...rest,
            title,
            slug,
            content: sanitizedContent,
            author: req.user.username,
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(new ApiResponse(201, savedBlog, 'Blog created successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, 'Error creating blog'));
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}, { content: 0 });
        res.status(200).json(new ApiResponse(200, blogs, 'Blogs fetched successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, 'Error fetching blogs'));
    }
};

exports.getBlogByIdentifier = async (req, res) => {
    try {
        const identifier = req.params.identifier;
        const query = isNaN(parseInt(identifier)) ? { slug: identifier } : { blogId: parseInt(identifier) };

        const canManageComments = req.permissions && req.permissions.has('comments:manage');

        const blog = await Blog.findOneAndUpdate(query, { $inc: { views: 1 } }, { new: true });

        if (!blog) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
        }

        if (!canManageComments) {
            blog.comments = blog.comments.filter(comment => comment.status === 'active');
        }

        res.status(200).json(new ApiResponse(200, blog, 'Blog fetched successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, 'Error fetching blog'));
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { title, content, ...rest } = req.body;

        if (!title && !content) {
            return res.status(400).json(new ApiResponse(400, null, 'Title or content is required to update'));
        }

        const updateData = { ...rest, updatedAt: new Date() };

        if (title) {
            updateData.title = title;
            updateData.slug = slugify(title);
        }

        if (content) {
            updateData.content = sanitizeHtml(content);
        }

        const updatedBlog = await Blog.findOneAndUpdate(
            { blogId: parseInt(req.params.blogId) },
            updateData,
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
        }

        res.status(200).json(new ApiResponse(200, updatedBlog, 'Blog updated successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, 'Error updating blog'));
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findOneAndDelete({ blogId: parseInt(req.params.blogId) });

        if (!deletedBlog) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Blog deleted successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, 'Error deleting blog'));
    }
};

exports.likeBlog = async (req, res) => {
    try {
        const likedBlog = await Blog.findOneAndUpdate(
            { blogId: parseInt(req.params.blogId) },
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!likedBlog) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Blog liked successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, 'Error liking blog'));
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json(new ApiResponse(400, null, 'Comment text is required'));
        }

        const newComment = {
            user: req.user.username,
            text,
        };

        const updatedBlog = await Blog.findOneAndUpdate(
            { blogId: parseInt(req.params.blogId) },
            { $push: { comments: newComment } },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
        }

        res.status(201).json(new ApiResponse(201, newComment, 'Comment added successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, 'Error adding comment'));
    }
};

exports.updateCommentStatus = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid status'));
        }

        const updatedBlog = await Blog.findOneAndUpdate(
            { blogId: parseInt(blogId), "comments._id": commentId },
            { $set: { "comments.$.status": status } },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog or comment not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Comment status updated successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, 'Error updating comment status'));
    }
};