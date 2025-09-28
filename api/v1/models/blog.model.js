const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    user: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const blogSchema = new Schema({
    blogId: { type: Number, unique: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    short_description: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    featured_image: { type: String, default: '' },
    meta_title: { type: String, default: '' },
    meta_description: { type: String, default: '' },
    meta_keywords: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [commentSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);