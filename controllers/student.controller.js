const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  studentSchema,
  updateStudentSchema,
  studentIdSchema,
} = require("../validations/student.validation");

const checkLidExists = async (lid_id) => {
  const result = await pool.query("SELECT id FROM lid WHERE id = $1", [lid_id]);
  if (!result.rowCount) {
    throw new Error("Lid not found");
  }
};

const addStudent = async (req, res) => {
  try {
    const { error, value } = studentSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    await checkLidExists(value.lid_id);

    const newStudent = await pool.query(
      `INSERT INTO students (lid_id, birth_date, gender) VALUES ($1, $2, $3) RETURNING *`,
      [value.lid_id, value.birth_date, value.gender]
    );

    res
      .status(201)
      .send({ message: "Student created", student: newStudent.rows[0] });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.status(200).send(result.rows);
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const getStudent = async (req, res) => {
  try {
    const { error, value } = studentIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query("SELECT * FROM students WHERE id = $1", [
      value.id,
    ]);
    if (!result.rowCount)
      return res.status(404).send({ message: "Student not found" });

    res.status(200).send(result.rows[0]);
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const updateStudent = async (req, res) => {
  try {
    const { error: idError, value: idValue } = studentIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } = updateStudentSchema.validate(
      req.body
    );
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    if (bodyValue.lid_id) {
      await checkLidExists(bodyValue.lid_id);
    }

    const keys = Object.keys(bodyValue);
    const updates = keys
      .map((key, i) => `${key === "gender" ? "gender" : key} = $${i + 1}`)
      .join(", ");
    const values = Object.values(bodyValue);

    const result = await pool.query(
      `UPDATE students SET ${updates} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, idValue.id]
    );

    if (!result.rowCount)
      return res.status(404).send({ message: "Student not found" });

    res
      .status(200)
      .send({ message: "Student updated", student: result.rows[0] });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { error, value } = studentIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [value.id]
    );
    if (!result.rowCount)
      return res.status(404).send({ message: "Student not found" });

    res
      .status(200)
      .send({ message: "Student deleted", student: result.rows[0] });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};
