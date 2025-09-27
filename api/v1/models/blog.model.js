
const Joi = require('joi');

// Schema for individual comments
const commentSchema = Joi.object({
    user: Joi.string().required(),
    text: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date()),
    status: Joi.string().valid('active', 'inactive').default('active')
});

const blogSchema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string(), // This will be auto-generated from the title
    short_description: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(), // In a real app, this would be a reference to a user ID
    featured_image: Joi.string().uri().allow(''), // Must be a valid URI, can be empty
    
    // SEO Fields
    meta_title: Joi.string().allow(''),
    meta_description: Joi.string().allow(''),
    meta_keywords: Joi.array().items(Joi.string()).default([]),

    tags: Joi.array().items(Joi.string()).default([]),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
    views: Joi.number().integer().min(0).default(0),
    likes: Joi.number().integer().min(0).default(0),
    comments: Joi.array().items(commentSchema).default([]),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date())
});

module.exports = blogSchema;
