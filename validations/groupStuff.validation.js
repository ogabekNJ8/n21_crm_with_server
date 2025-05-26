const Joi = require("joi");

const groupStuffSchema = Joi.object({
  group_id: Joi.number().integer().required(),
  stuff_id: Joi.number().integer().required(),
});

const groupStuffIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

const updateGroupStuffSchema = Joi.object({
  group_id: Joi.number().integer(),
  stuff_id: Joi.number().integer(),
}).min(1); 

module.exports = {
  groupStuffSchema,
  groupStuffIdSchema,
  updateGroupStuffSchema,
};
