const Joi = require("joi");

const stuffRoleSchema = Joi.object({
  stuff_id: Joi.number().integer().required(),
  role_id: Joi.number().integer().required(),
});

const updateStuffRoleSchema = Joi.object({
  stuff_id: Joi.number().integer(),
  role_id: Joi.number().integer(),
}).min(1);

const stuffRoleIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  stuffRoleSchema,
  updateStuffRoleSchema,
  stuffRoleIdSchema,
};
