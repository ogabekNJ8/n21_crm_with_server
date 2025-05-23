const Joi = require("joi");

const stageSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().allow("").max(255),
});

const stageUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().allow("").max(255),
});

const stageIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  stageSchema,
  stageUpdateSchema,
  stageIdSchema,
};
