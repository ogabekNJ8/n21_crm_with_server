const Joi = require("joi");

const studentLessonSchema = Joi.object({
  student_id: Joi.number().integer().required(),
  lesson_id: Joi.number().integer().required(),
  attendance: Joi.boolean().required(),
  be_paid: Joi.boolean().required(),
});

const updateStudentLessonSchema = Joi.object({
  student_id: Joi.number().integer(),
  lesson_id: Joi.number().integer(),
  attendance: Joi.boolean(),
  be_paid: Joi.boolean(),
}).min(1);

const studentLessonIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  studentLessonSchema,
  updateStudentLessonSchema,
  studentLessonIdSchema,
};
