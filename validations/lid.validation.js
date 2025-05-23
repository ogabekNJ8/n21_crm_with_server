const Joi = require("joi");

const lidSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).required(),
  last_name: Joi.string().min(2).max(100).required(),
  phone_number: Joi.string().min(7).max(15).required(),
  lid_stage_id: Joi.number().integer().positive().required(),
  test_date: Joi.date().required(),
  trial_lesson_date: Joi.date().required(),
  trial_lesson_time: Joi.string().required(),
  trial_lesson_group_id: Joi.number().integer().positive().required(),
  lid_status_id: Joi.number().integer().positive().required(),
  cancel_reson_id: Joi.number().integer().positive(),
});

const updateLidSchema = Joi.object({
  first_name: Joi.string().min(2).max(100),
  last_name: Joi.string().min(2).max(100),
  phone_number: Joi.string().min(7).max(15),
  lid_stage_id: Joi.number().integer().positive(),
  test_date: Joi.date(),
  trial_lesson_date: Joi.date(),
  trial_lesson_time: Joi.string(),
  trial_lesson_group_id: Joi.number().integer().positive(),
  lid_status_id: Joi.number().integer().positive(),
  cancel_reson_id: Joi.number().integer().positive(),
}).min(1); 

const lidIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  lidSchema,
  updateLidSchema,
  lidIdSchema,
};
