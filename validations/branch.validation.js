const Joi = require("joi");

const branchSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  address: Joi.string().min(5).max(255).required(),
  call_number: Joi.string()
    .pattern(/^[0-9+\-\s]{7,20}$/)
    .required()
    .messages({
      "string.pattern.base": `"call_number" format is invalid`,
    }),
});

const updateBranchSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  address: Joi.string().min(5).max(255),
  call_number: Joi.string()
    .pattern(/^[0-9+\-\s]{7,20}$/)
    .messages({
      "string.pattern.base": `"call_number" format is invalid`,
    }),
}).min(1);

const branchIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  branchSchema,
  updateBranchSchema,
  branchIdSchema,
};
