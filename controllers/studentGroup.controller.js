const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  studentGroupSchema,
  updateStudentGroupSchema,
  studentGroupIdSchema,
} = require("../validations/studentGroup.validation");

const checkStudentExists = async (student_id) => {
  const result = await pool.query("SELECT id FROM students WHERE id = $1", [
    student_id,
  ]);
  if (!result.rowCount) throw new Error("Student not found");
};

const checkGroupExists = async (group_id) => {
  const result = await pool.query('SELECT id FROM \"group\" WHERE id = $1', [
    group_id,
  ]);
  if (!result.rowCount) throw new Error("Group not found");
};

const addStudentGroup = async (req, res) => {
  try {
    const { error, value } = studentGroupSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    await checkStudentExists(value.student_id);
    await checkGroupExists(value.group_id);

    const result = await pool.query(
      `INSERT INTO student_group (student_id, group_id) VALUES ($1, $2) RETURNING *`,
      [value.student_id, value.group_id]
    );

    res
      .status(201)
      .send({ message: "Student group created", studentGroup: result.rows[0] });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const getAllStudentGroups = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM student_group");
    res.status(200).send(result.rows);
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const getStudentGroup = async (req, res) => {
  try {
    const { error, value } = studentGroupIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query(
      "SELECT * FROM student_group WHERE id = $1",
      [value.id]
    );
    if (!result.rowCount)
      return res.status(404).send({ message: "Student group not found" });

    res.status(200).send(result.rows[0]);
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const updateStudentGroup = async (req, res) => {
  try {
    const { error: idError, value: idValue } = studentGroupIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } =
      updateStudentGroupSchema.validate(req.body);
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    if (bodyValue.student_id) await checkStudentExists(bodyValue.student_id);
    if (bodyValue.group_id) await checkGroupExists(bodyValue.group_id);

    const keys = Object.keys(bodyValue);
    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = Object.values(bodyValue);

    const result = await pool.query(
      `UPDATE student_group SET ${updates} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, idValue.id]
    );

    if (!result.rowCount)
      return res.status(404).send({ message: "Student group not found" });

    res
      .status(200)
      .send({ message: "Student group updated", studentGroup: result.rows[0] });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const deleteStudentGroup = async (req, res) => {
  try {
    const { error, value } = studentGroupIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query(
      "DELETE FROM student_group WHERE id = $1 RETURNING *",
      [value.id]
    );
    if (!result.rowCount)
      return res.status(404).send({ message: "Student group not found" });

    res
      .status(200)
      .send({ message: "Student group deleted", studentGroup: result.rows[0] });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

module.exports = {
  addStudentGroup,
  getAllStudentGroups,
  getStudentGroup,
  updateStudentGroup,
  deleteStudentGroup,
};
