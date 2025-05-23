const Joi = require("joi");

const studentSchema = Joi.object({
  lid_id: Joi.number().integer().required(),
  birth_date: Joi.date().iso().required(),
  gender: Joi.string().valid("male", "female").required(),
});

const updateStudentSchema = Joi.object({
  lid_id: Joi.number().integer(),
  birth_date: Joi.date().iso(),
  gender: Joi.string().valid("male", "female"),
}).min(1);

const studentIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  studentSchema,
  updateStudentSchema,
  studentIdSchema,
};
