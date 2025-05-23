const Joi = require("joi");

const statusSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().allow("").max(255),
});

const statusUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().allow("").max(255),
});

const statusIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  statusSchema,
  statusUpdateSchema,
  statusIdSchema,
};
