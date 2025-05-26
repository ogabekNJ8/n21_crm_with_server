const Joi = require("joi");

const stuffSchema = Joi.object({
  first_name: Joi.string().max(255).required(),
  last_name: Joi.string().max(255).required(),
  phone_number: Joi.string().max(255).required(),
  login: Joi.string().max(255).required(),
  parol: Joi.string().max(255).required(),
  is_active: Joi.boolean().required(),
});

const updateStuffSchema = Joi.object({
  first_name: Joi.string().max(255),
  last_name: Joi.string().max(255),
  phone_number: Joi.string().max(255),
  login: Joi.string().max(255),
  parol: Joi.string().max(255),
  is_active: Joi.boolean(),
});

const stuffIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  stuffSchema,
  updateStuffSchema,
  stuffIdSchema,
};
