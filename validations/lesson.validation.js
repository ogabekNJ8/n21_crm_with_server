const Joi = require("joi");

const lessonSchema = Joi.object({
  lesson_theme: Joi.string().max(255).required(),
  lesson_number: Joi.number().integer().required(),
  group_id: Joi.number().integer().required(),
  lesson_date: Joi.date().iso().required(),
});

const updateLessonSchema = Joi.object({
  lesson_theme: Joi.string().max(255),
  lesson_number: Joi.number().integer(),
  group_id: Joi.number().integer(),
  lesson_date: Joi.date().iso(),
}).min(1);

const lessonIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  lessonSchema,
  updateLessonSchema,
  lessonIdSchema,
};
