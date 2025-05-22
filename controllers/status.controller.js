const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");

const addStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const newStatus = await pool.query(
      `INSERT INTO status (status) VALUES ($1) RETURNING *`,
      [status]
    );
    res.status(201).send({
      message: "Status created successfully!",
      status: newStatus.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getAllStatuses = async (req, res) => {
  try {
    const statuses = await pool.query(`SELECT * FROM status`);
    res.status(200).send(statuses.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await pool.query(`SELECT * FROM status WHERE id = $1`, [id]);
    if (!status.rowCount)
      return res.status(404).send({ message: "Status not found" });

    res.status(200).send(status.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedStatus = await pool.query(
      `UPDATE status SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (!updatedStatus.rowCount) {
      return res.status(404).send({ message: "Status not found" });
    }

    res.status(200).send({
      message: "Status updated successfully",
      status: updatedStatus.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await pool.query(
      `DELETE FROM status WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!status.rowCount) {
      return res.status(404).send({ message: "Status not found" });
    }

    res.status(200).send({
      message: "Status deleted successfully!",
      status: status.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addStatus,
  getAllStatuses,
  getStatus,
  updateStatus,
  deleteStatus,
};
