const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");

const addRole = async (req, res) => {
  try {
    const { name } = req.body;

    const newRole = await pool.query(
      `
      INSERT INTO roles (name)
      VALUES ($1) RETURNING *
      `,
      [name]
    );

    res
      .status(201)
      .send({ message: "Role created successfully!", role: newRole.rows[0] });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await pool.query(`SELECT * FROM roles ORDER BY id`);
    res.status(200).send(roles.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await pool.query(`SELECT * FROM roles WHERE id = $1`, [id]);

    if (!role.rowCount)
      return res.status(404).send({ message: "Role not found" });

    res.status(200).send(role.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedRole = await pool.query(
      `UPDATE roles SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id]
    );

    if (!updatedRole.rowCount) {
      return res.status(404).send({ message: "Role not found" });
    }

    res.status(200).send({
      message: "Role updated successfully",
      role: updatedRole.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await pool.query(
      "DELETE FROM roles WHERE id = $1 RETURNING *",
      [id]
    );

    if (!role.rowCount) {
      return res.status(404).send({ message: "ID not found" });
    }

    res
      .status(200)
      .send({ message: "Role deleted successfully!", role: role.rows[0] });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addRole,
  getRole,
  getAllRoles,
  updateRole,
  deleteRole,
};
