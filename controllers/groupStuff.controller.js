const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  groupStuffSchema,
  groupStuffIdSchema,
  updateGroupStuffSchema,
} = require("../validations/groupStuff.validation");

const addGroupStuff = async (req, res) => {
  try {
    const { error, value } = groupStuffSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const group = await pool.query('SELECT id FROM "group" WHERE id = $1', [
      value.group_id,
    ]);
    if (!group.rowCount)
      return res.status(400).send({ message: "Group not found" });

    const stuff = await pool.query('SELECT id FROM "stuff" WHERE id = $1', [
      value.stuff_id,
    ]);
    if (!stuff.rowCount)
      return res.status(400).send({ message: "Stuff not found" });

    const result = await pool.query(
      `INSERT INTO group_stuff (group_id, stuff_id) VALUES ($1, $2) RETURNING *`,
      [value.group_id, value.stuff_id]
    );

    res.status(201).send({
      message: "GroupStuff created successfully",
      groupStuff: result.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getAllGroupStuff = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM group_stuff");
    res.status(200).send(result.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getGroupStuff = async (req, res) => {
  try {
    const { error, value } = groupStuffIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query("SELECT * FROM group_stuff WHERE id = $1", [
      value.id,
    ]);
    if (!result.rowCount)
      return res.status(404).send({ message: "GroupStuff not found" });

    res.status(200).send(result.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const updateGroupStuff = async (req, res) => {
  try {
    const { error: idError, value: idValue } = groupStuffIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } =
      updateGroupStuffSchema.validate(req.body);
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    if (bodyValue.group_id) {
      const group = await pool.query('SELECT id FROM "group" WHERE id = $1', [
        bodyValue.group_id,
      ]);
      if (!group.rowCount)
        return res.status(400).send({ message: "Group not found" });
    }

    if (bodyValue.stuff_id) {
      const stuff = await pool.query('SELECT id FROM "stuff" WHERE id = $1', [
        bodyValue.stuff_id,
      ]);
      if (!stuff.rowCount)
        return res.status(400).send({ message: "Stuff not found" });
    }

    const keys = Object.keys(bodyValue);
    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = Object.values(bodyValue);

    const result = await pool.query(
      `UPDATE group_stuff SET ${updates} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, idValue.id]
    );

    if (!result.rowCount)
      return res.status(404).send({ message: "GroupStuff not found" });

    res.status(200).send({
      message: "GroupStuff updated successfully",
      groupStuff: result.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const deleteGroupStuff = async (req, res) => {
  try {
    const { error, value } = groupStuffIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const deleted = await pool.query(
      "DELETE FROM group_stuff WHERE id = $1 RETURNING *",
      [value.id]
    );
    if (!deleted.rowCount)
      return res.status(404).send({ message: "GroupStuff not found" });

    res.status(200).send({
      message: "GroupStuff deleted successfully",
      groupStuff: deleted.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addGroupStuff,
  getAllGroupStuff,
  getGroupStuff,
  updateGroupStuff,
  deleteGroupStuff,
};
