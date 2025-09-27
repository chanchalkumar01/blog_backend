
const Joi = require('joi');

const roleSchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).default([]),
    createdAt: Joi.date().default(() => new Date())
});

module.exports = roleSchema;
