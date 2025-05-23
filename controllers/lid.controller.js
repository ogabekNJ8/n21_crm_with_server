const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  lidSchema,
  updateLidSchema,
  lidIdSchema,
} = require("../validations/lid.validation");

const checkForeignKeys = async (data) => {
  const checks = [
    ["SELECT * FROM stage WHERE id = $1", data.lid_stage_id],
    ["SELECT * FROM \"group\" WHERE id = $1", data.trial_lesson_group_id],
    ["SELECT * FROM status WHERE id = $1", data.lid_status_id],
    ["SELECT * FROM reason WHERE id = $1", data.cancel_reason_id],
  ];

  for (const [query, id] of checks) {
    if (id !== undefined) {
      const check = await pool.query(query, [id]);
      if (!check.rowCount) {
        throw new Error(`Foreign key not found: ${query.split(" ")[3]}`);
      }
    }
  }
};

const addLid = async (req, res) => {
  try {
    const { error, value } = lidSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    await checkForeignKeys(value);

    const newLid = await pool.query(
      `INSERT INTO lid (first_name, last_name, phone_number, lid_stage_id, test_date, trial_lesson_date, trial_lesson_time, trial_lesson_group_id, lid_status_id, cancel_reason_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        value.first_name,
        value.last_name,
        value.phone_number,
        value.lid_stage_id,
        value.test_date,
        value.trial_lesson_date,
        value.trial_lesson_time,
        value.trial_lesson_group_id,
        value.lid_status_id,
        value.cancel_reason_id,
      ]
    );

    res.status(201).send({
      message: "Lid created successfully!",
      lid: newLid.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getAllLids = async (req, res) => {
  try {
    const lids = await pool.query("SELECT * FROM lid");
    res.status(200).send(lids.rows);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const getLid = async (req, res) => {
  try {
    const { error, value } = lidIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const lid = await pool.query("SELECT * FROM lid WHERE id = $1", [value.id]);
    if (!lid.rowCount)
      return res.status(404).send({ message: "Lid not found" });

    res.status(200).send(lid.rows[0]);
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const updateLid = async (req, res) => {
  try {
    const { error: idError, value: idValue } = lidIdSchema.validate(req.params);
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } = updateLidSchema.validate(
      req.body
    );
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    await checkForeignKeys(bodyValue);

    const keys = Object.keys(bodyValue);
    const updates = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = Object.values(bodyValue);

    const updatedLid = await pool.query(
      `UPDATE lid SET ${updates} WHERE id = $${values.length + 1} RETURNING *`,
      [...values, idValue.id]
    );

    if (!updatedLid.rowCount)
      return res.status(404).send({ message: "Lid not found" });

    res.status(200).send({
      message: "Lid updated successfully",
      lid: updatedLid.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const deleteLid = async (req, res) => {
  try {
    const { error, value } = lidIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const deletedLid = await pool.query(
      "DELETE FROM lid WHERE id = $1 RETURNING *",
      [value.id]
    );
    if (!deletedLid.rowCount)
      return res.status(404).send({ message: "Lid not found" });

    res.status(200).send({
      message: "Lid deleted successfully!",
      lid: deletedLid.rows[0],
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addLid,
  getAllLids,
  getLid,
  updateLid,
  deleteLid,
};
