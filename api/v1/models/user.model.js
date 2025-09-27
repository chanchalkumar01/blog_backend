
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    roles: Joi.array().items(Joi.string()).default([]), // Array of role IDs
    createdAt: Joi.date().default(() => new Date())
});

module.exports = userSchema;
