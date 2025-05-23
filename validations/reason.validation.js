const Joi = require("joi");

const reasonSchema = Joi.object({
  reason: Joi.string().min(3).max(255).required(),
});

const reasonUpdateSchema = Joi.object({
  reason: Joi.string().min(3).max(255).required(),
});

const reasonIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  reasonSchema,
  reasonUpdateSchema,
  reasonIdSchema,
};
