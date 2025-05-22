const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");

const addReason = async (req, res) => {
  try {
    const { reason } = req.body;
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
    const { id } = req.params;
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
    const { id } = req.params;
    const { reason } = req.body;

    const updatedReason = await pool.query(
      `UPDATE reason SET reason = $1 WHERE id = $2 RETURNING *`,
      [reason, id]
    );

    if (!updatedReason.rowCount) {
      return res.status(404).send({ message: "Reason not found" });
    }

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
    const { id } = req.params;
    const reason = await pool.query(
      `DELETE FROM reason WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!reason.rowCount) {
      return res.status(404).send({ message: "Reason not found" });
    }

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
