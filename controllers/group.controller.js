const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");

// CREATE
const addGroup = async (req, res) => {
  try {
    const {
      name,
      lesson_start_time,
      lesson_end_time,
      lesson_week_days,
      stage_id,
      branch_id,
      room_floor,
      room,
      lessons_quantity,
      is_active,
    } = req.body;

    const newGroup = await pool.query(
      `
      INSERT INTO "group" (
        name,
        lesson_start_time,
        lesson_end_time,
        lesson_week_days,
        stage_id,
        branch_id,
        room_floor,
        room,
        lessons_quantity,
        is_active
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        name,
        lesson_start_time,
        lesson_end_time,
        lesson_week_days,
        stage_id,
        branch_id,
        room_floor,
        room,
        lessons_quantity,
        is_active,
      ]
    );

    res.status(201).send({
      message: "Group created successfully!",
      group: newGroup.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

// READ ALL
const getAllGroups = async (req, res) => {
  try {
    const groups = await pool.query(`SELECT * FROM "group"`);
    res.status(200).send(groups.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

// READ ONE
const getGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await pool.query(`SELECT * FROM "group" WHERE id = $1`, [id]);

    if (!group.rowCount) {
      return res.status(404).send({ message: "Group not found" });
    }

    res.status(200).send(group.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

// UPDATE
const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      lesson_start_time,
      lesson_end_time,
      lesson_week_days,
      stage_id,
      branch_id,
      room_floor,
      room,
      lessons_quantity,
      is_active,
    } = req.body;

    const updatedGroup = await pool.query(
      `
      UPDATE "group" SET
        name = $1,
        lesson_start_time = $2,
        lesson_end_time = $3,
        lesson_week_days = $4,
        stage_id = $5,
        branch_id = $6,
        room_floor = $7,
        room = $8,
        lessons_quantity = $9,
        is_active = $10
      WHERE id = $11
      RETURNING *
      `,
      [
        name,
        lesson_start_time,
        lesson_end_time,
        lesson_week_days,
        stage_id,
        branch_id,
        room_floor,
        room,
        lessons_quantity,
        is_active,
        id,
      ]
    );

    if (!updatedGroup.rowCount) {
      return res.status(404).send({ message: "Group not found" });
    }

    res.status(200).send({
      message: "Group updated successfully!",
      group: updatedGroup.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

// DELETE
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM "group" WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!deleted.rowCount) {
      return res.status(404).send({ message: "Group not found" });
    }

    res.status(200).send({
      message: "Group deleted successfully!",
      group: deleted.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addGroup,
  getAllGroups,
  getGroup,
  updateGroup,
  deleteGroup,
};
