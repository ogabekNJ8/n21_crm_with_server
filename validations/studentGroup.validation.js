const Joi = require("joi");

const studentGroupSchema = Joi.object({
  student_id: Joi.number().integer().required(),
  group_id: Joi.number().integer().required(),
});

const updateStudentGroupSchema = Joi.object({
  student_id: Joi.number().integer(),
  group_id: Joi.number().integer(),
}).min(1);

const studentGroupIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  studentGroupSchema,
  updateStudentGroupSchema,
  studentGroupIdSchema,
};
