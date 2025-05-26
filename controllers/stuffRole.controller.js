const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  stuffRoleSchema,
  updateStuffRoleSchema,
  stuffRoleIdSchema,
} = require("../validations/stuffRole.validation");

const addStuffRole = async (req, res) => {
  try {
    const { error, value } = stuffRoleSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const stuffCheck = await pool.query(
      `SELECT id FROM "stuff" WHERE id = $1`,
      [value.stuff_id]
    );
    if (!stuffCheck.rowCount)
      return res.status(400).send({ message: "Stuff not found" });

    const roleCheck = await pool.query(`SELECT id FROM role WHERE id = $1`, [
      value.role_id,
    ]);
    if (!roleCheck.rowCount)
      return res.status(400).send({ message: "Role not found" });

    const newStuffRole = await pool.query(
      `INSERT INTO stuff_role (stuff_id, role_id) VALUES ($1, $2) RETURNING *`,
      [value.stuff_id, value.role_id]
    );

    res
      .status(201)
      .send({ message: "Stuff role added", stuff_role: newStuffRole.rows[0] });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getAllStuffRoles = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM stuff_role`);
    res.status(200).send(result.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getStuffRole = async (req, res) => {
  try {
    const { error, value } = stuffRoleIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query(`SELECT * FROM stuff_role WHERE id = $1`, [
      value.id,
    ]);
    if (!result.rowCount)
      return res.status(404).send({ message: "Stuff role not found" });

    res.status(200).send(result.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const updateStuffRole = async (req, res) => {
  try {
    const { error: idError, value: idValue } = stuffRoleIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } =
      updateStuffRoleSchema.validate(req.body);
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    const keys = Object.keys(bodyValue);
    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = Object.values(bodyValue);

    const updated = await pool.query(
      `UPDATE stuff_role SET ${updates} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, idValue.id]
    );

    if (!updated.rowCount)
      return res.status(404).send({ message: "Stuff role not found" });

    res
      .status(200)
      .send({ message: "Stuff role updated", stuff_role: updated.rows[0] });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const deleteStuffRole = async (req, res) => {
  try {
    const { error, value } = stuffRoleIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const deleted = await pool.query(
      `DELETE FROM stuff_role WHERE id = $1 RETURNING *`,
      [value.id]
    );

    if (!deleted.rowCount)
      return res.status(404).send({ message: "Stuff role not found" });

    res
      .status(200)
      .send({ message: "Stuff role deleted", stuff_role: deleted.rows[0] });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addStuffRole,
  getAllStuffRoles,
  getStuffRole,
  updateStuffRole,
  deleteStuffRole,
};
