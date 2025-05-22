const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");

const addBranch = async (req, res) => {
  try {
    const { name, address } = req.body;

    const newBranch = await pool.query(
      `INSERT INTO branch (name, address) VALUES ($1, $2) RETURNING *`,
      [name, address]
    );

    res.status(201).send({
      message: "Branch created successfully!",
      branch: newBranch.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getAllBranches = async (req, res) => {
  try {
    const branches = await pool.query(`SELECT * FROM branch`);
    res.status(200).send(branches.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const branch = await pool.query(`SELECT * FROM branch WHERE id = $1`, [id]);

    if (!branch.rowCount) {
      return res.status(404).send({ message: "Branch not found" });
    }

    res.status(200).send(branch.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;

    const updated = await pool.query(
      `UPDATE branch SET name = $1, address = $2 WHERE id = $3 RETURNING *`,
      [name, address, id]
    );

    if (!updated.rowCount) {
      return res.status(404).send({ message: "Branch not found" });
    }

    res.status(200).send({
      message: "Branch updated successfully!",
      branch: updated.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await pool.query(
      `DELETE FROM branch WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!deleted.rowCount) {
      return res.status(404).send({ message: "Branch not found" });
    }

    res.status(200).send({
      message: "Branch deleted successfully!",
      branch: deleted.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addBranch,
  getAllBranches,
  getBranch,
  updateBranch,
  deleteBranch,
};
