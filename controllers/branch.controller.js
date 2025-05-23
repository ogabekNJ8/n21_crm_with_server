const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  branchSchema,
  updateBranchSchema,
  branchIdSchema,
} = require("../validations/branch.validation");

const addBranch = async (req, res) => {
  try {
    const { error, value } = branchSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { name, address, call_number } = value;

    const newBranch = await pool.query(
      `INSERT INTO branch (name, address, call_number) VALUES ($1, $2, $3) RETURNING *`,
      [name, address, call_number]
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
    const { error, value } = branchIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const branch = await pool.query(`SELECT * FROM branch WHERE id = $1`, [
      value.id,
    ]);

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
    const { error: idError, value: idValue } = branchIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } = updateBranchSchema.validate(
      req.body
    );
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    const fields = Object.keys(bodyValue);
    const values = Object.values(bodyValue);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");
      
    const query = `UPDATE branch SET ${setClause} WHERE id = $${
      values.length + 1
    } RETURNING *`;

    const updated = await pool.query(query, [...values, idValue.id]);

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
    const { error, value } = branchIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const deleted = await pool.query(
      `DELETE FROM branch WHERE id = $1 RETURNING *`,
      [value.id]
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
