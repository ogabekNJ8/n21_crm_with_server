const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  paymentSchema,
  updatePaymentSchema,
  paymentIdSchema,
} = require("../validations/payment.validation");

const addPayment = async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const studentCheck = await pool.query(
      "SELECT id FROM students WHERE id = $1",
      [value.student_id]
    );
    if (!studentCheck.rowCount)
      return res.status(400).send({ message: "Student not found" });

    const newPayment = await pool.query(
      `INSERT INTO payment (student_id, payment_last_date, payment_date, price, is_paid)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        value.student_id,
        value.payment_last_date,
        value.payment_date,
        value.price,
        value.is_paid,
      ]
    );

    res.status(201).send({
      message: "Payment created successfully",
      payment: newPayment.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getAllPayments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payment");
    res.status(200).send(result.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getPayment = async (req, res) => {
  try {
    const { error, value } = paymentIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const payment = await pool.query("SELECT * FROM payment WHERE id = $1", [
      value.id,
    ]);
    if (!payment.rowCount)
      return res.status(404).send({ message: "Payment not found" });

    res.status(200).send(payment.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const updatePayment = async (req, res) => {
  try {
    const { error: idError, value: idValue } = paymentIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } = updatePaymentSchema.validate(
      req.body
    );
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    const keys = Object.keys(bodyValue);
    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = Object.values(bodyValue);

    const updated = await pool.query(
      `UPDATE payment SET ${updates} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, idValue.id]
    );

    if (!updated.rowCount)
      return res.status(404).send({ message: "Payment not found" });

    res
      .status(200)
      .send({ message: "Payment updated", payment: updated.rows[0] });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const deletePayment = async (req, res) => {
  try {
    const { error, value } = paymentIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const deleted = await pool.query(
      "DELETE FROM payment WHERE id = $1 RETURNING *",
      [value.id]
    );
    if (!deleted.rowCount)
      return res.status(404).send({ message: "Payment not found" });

    res
      .status(200)
      .send({ message: "Payment deleted", payment: deleted.rows[0] });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addPayment,
  getAllPayments,
  getPayment,
  updatePayment,
  deletePayment,
};
