const Joi = require("joi");

const paymentSchema = Joi.object({
  student_id: Joi.number().integer().required(),
  payment_last_date: Joi.date().required(),
  payment_date: Joi.date().required(),
  price: Joi.number().precision(2).required(),
  is_paid: Joi.boolean().required(),
});

const updatePaymentSchema = Joi.object({
  student_id: Joi.number().integer(),
  payment_last_date: Joi.date(),
  payment_date: Joi.date(),
  price: Joi.number().precision(2),
  is_paid: Joi.boolean(),
}).min(1);

const paymentIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  paymentSchema,
  updatePaymentSchema,
  paymentIdSchema,
};
