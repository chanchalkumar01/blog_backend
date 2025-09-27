const { ObjectId } = require('mongodb');
const blogSchema = require('../models/blog.model');
const sanitizeHtml = require('sanitize-html');
const { ApiResponse } = require('../apiResponses');

const COLLECTION_NAME = 'blogs';

async function getNextSequenceValue(db, sequenceName) {
    const sequenceDocument = await db.collection('counters').findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true }
    );
    return sequenceDocument.seq;
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

exports.createBlog = async (req, res) => {
    try {
        const db = req.app.get('db');
        await db.collection('counters').updateOne({ _id: 'blogId' }, { $setOnInsert: { seq: 0 } }, { upsert: true });

        const { error, value } = blogSchema.validate(req.body);
        if (error) {
            return res.status(400).json(new ApiResponse(400, error.details, 'Invalid blog data'));
        }

        const sanitizedContent = sanitizeHtml(value.content);
        const slug = slugify(value.title);

        const blogId = await getNextSequenceValue(db, 'blogId');
        const newBlog = {
            blogId: blogId,
            ...value,
            slug: slug,
            content: sanitizedContent,
            author: req.user.username,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.insertOne(newBlog);
        const createdBlog = await collection.findOne({ _id: result.insertedId });
        res.status(201).json(new ApiResponse(201, createdBlog, 'Blog created successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error creating blog'));
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const db = req.app.get('db');
        const collection = db.collection(COLLECTION_NAME);
        const blogs = await collection.find({}, { projection: { content: 0 } }).toArray();
        res.status(200).json(new ApiResponse(200, blogs, 'Blogs fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error fetching blogs'));
    }
};

exports.getBlogByIdentifier = async (req, res) => {
    try {
        const db = req.app.get('db');
        const identifier = req.params.identifier;
        const query = isNaN(parseInt(identifier)) ? { slug: identifier } : { blogId: parseInt(identifier) };

        const collection = db.collection(COLLECTION_NAME);
        await collection.updateOne(query, { $inc: { views: 1 } });

        const canManageComments = req.permissions && req.permissions.has('comments:manage');
        const aggregationPipeline = [
            { $match: query },
            {
                $addFields: {
                    comments: canManageComments ? "$comments" : {
                        $filter: {
                            input: "$comments",
                            as: "comment",
                            cond: { $eq: [ "$$comment.status", "active" ] }
                        }
                    }
                }
            }
        ];

        const blog = await collection.aggregate(aggregationPipeline).next();

        if (!blog) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
        }

        res.status(200).json(new ApiResponse(200, blog, 'Blog fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error fetching blog'));
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const db = req.app.get('db');
        const { error, value } = blogSchema.validate(req.body);
        if (error) {
            return res.status(400).json(new ApiResponse(400, error.details, 'Invalid blog data'));
        }
        
        const sanitizedContent = sanitizeHtml(value.content);
        const slug = slugify(value.title);

        const collection = db.collection(COLLECTION_NAME);
        const updateData = { ...value, slug: slug, content: sanitizedContent, updatedAt: new Date() };
        delete updateData._id;

        const result = await collection.updateOne(
            { blogId: parseInt(req.params.blogId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Blog updated successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error updating blog'));
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const db = req.app.get('db');
        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.deleteOne({ blogId: parseInt(req.params.blogId) });

        if (result.deletedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Blog deleted successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error deleting blog'));
    }
};

exports.likeBlog = async (req, res) => {
    try {
        const db = req.app.get('db');
        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.updateOne(
            { blogId: parseInt(req.params.blogId) },
            { $inc: { likes: 1 } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Blog liked successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error liking blog'));
    }
};

exports.addComment = async (req, res) => {
    try {
        const db = req.app.get('db');
        const newComment = {
            _id: new ObjectId(),
            user: req.user.username,
            text: req.body.text,
            createdAt: new Date(),
            status: 'active'
        };

        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.updateOne(
            { blogId: parseInt(req.params.blogId) },
            { $push: { comments: newComment } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
        }

        res.status(201).json(new ApiResponse(201, newComment, 'Comment added successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error adding comment'));
    }
};

exports.updateCommentStatus = async (req, res) => {
    try {
        const db = req.app.get('db');
        const { blogId, commentId } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid status'));
        }

        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.updateOne(
            { blogId: parseInt(blogId), "comments._id": new ObjectId(commentId) },
            { $set: { "comments.$.status": status } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, 'Blog or comment not found'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Comment status updated successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error updating comment status'));
    }
};