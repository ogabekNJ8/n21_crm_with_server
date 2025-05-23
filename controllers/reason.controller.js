const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  reasonSchema,
  reasonUpdateSchema,
  reasonIdSchema,
} = require("../validations/reason.validation");

const addReason = async (req, res) => {
  try {
    const { error, value } = reasonSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { reason } = value;

    const newReason = await pool.query(
      `INSERT INTO reason (reason) VALUES ($1) RETURNING *`,
      [reason]
    );

    res.status(201).send({
      message: "Reason created successfully!",
      reason: newReason.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getAllReasons = async (req, res) => {
  try {
    const reasons = await pool.query(`SELECT * FROM reason`);
    res.status(200).send(reasons.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getReason = async (req, res) => {
  try {
    const { error, value } = reasonIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { id } = value;

    const reason = await pool.query(`SELECT * FROM reason WHERE id = $1`, [id]);

    if (!reason.rowCount)
      return res.status(404).send({ message: "Reason not found" });

    res.status(200).send(reason.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const updateReason = async (req, res) => {
  try {
    const { error: idError, value: idValue } = reasonIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } = reasonUpdateSchema.validate(
      req.body
    );
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    const { id } = idValue;
    const { reason } = bodyValue;

    const updatedReason = await pool.query(
      `UPDATE reason SET reason = $1 WHERE id = $2 RETURNING *`,
      [reason, id]
    );

    if (!updatedReason.rowCount)
      return res.status(404).send({ message: "Reason not found" });

    res.status(200).send({
      message: "Reason updated successfully",
      reason: updatedReason.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const deleteReason = async (req, res) => {
  try {
    const { error, value } = reasonIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { id } = value;

    const reason = await pool.query(
      `DELETE FROM reason WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!reason.rowCount)
      return res.status(404).send({ message: "Reason not found" });

    res.status(200).send({
      message: "Reason deleted successfully!",
      reason: reason.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addReason,
  getAllReasons,
  getReason,
  updateReason,
  deleteReason,
};
