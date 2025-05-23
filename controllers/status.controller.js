const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  statusSchema,
  statusUpdateSchema,
  statusIdSchema,
} = require("../validations/status.validation");

const addStatus = async (req, res) => {
  try {
    const { error, value } = statusSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { name, description } = value;

    const newStatus = await pool.query(
      `INSERT INTO status (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
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
    const { error, value } = statusIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { id } = value;

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
    const { error: idError, value: idValue } = statusIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } = statusUpdateSchema.validate(
      req.body
    );
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    const { id } = idValue;
    const { name, description } = bodyValue;

    const updatedStatus = await pool.query(
      `UPDATE status SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
      [name, description, id]
    );

    if (!updatedStatus.rowCount)
      return res.status(404).send({ message: "Status not found" });

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
    const { error, value } = statusIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { id } = value;

    const status = await pool.query(
      `DELETE FROM status WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!status.rowCount)
      return res.status(404).send({ message: "Status not found" });

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
