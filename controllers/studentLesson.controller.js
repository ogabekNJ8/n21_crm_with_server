const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  studentLessonSchema,
  updateStudentLessonSchema,
  studentLessonIdSchema,
} = require("../validations/studentLesson.validation");

const checkStudentExists = async (student_id) => {
  const result = await pool.query("SELECT id FROM students WHERE id = $1", [
    student_id,
  ]);
  if (!result.rowCount) throw new Error("Student not found");
};

const checkLessonExists = async (lesson_id) => {
  const result = await pool.query("SELECT id FROM lesson WHERE id = $1", [
    lesson_id,
  ]);
  if (!result.rowCount) throw new Error("Lesson not found");
};

const addStudentLesson = async (req, res) => {
  try {
    const { error, value } = studentLessonSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    await checkStudentExists(value.student_id);
    await checkLessonExists(value.lesson_id);

    const result = await pool.query(
      `INSERT INTO student_lesson (student_id, lesson_id, attendance, be_paid)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [value.student_id, value.lesson_id, value.attendance, value.be_paid]
    );

    res
      .status(201)
      .send({
        message: "Student lesson created",
        studentLesson: result.rows[0],
      });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const getAllStudentLessons = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM student_lesson");
    res.status(200).send(result.rows);
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const getStudentLesson = async (req, res) => {
  try {
    const { error, value } = studentLessonIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query(
      "SELECT * FROM student_lesson WHERE id = $1",
      [value.id]
    );
    if (!result.rowCount)
      return res.status(404).send({ message: "Student lesson not found" });

    res.status(200).send(result.rows[0]);
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const updateStudentLesson = async (req, res) => {
  try {
    const { error: idError, value: idValue } = studentLessonIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } =
      updateStudentLessonSchema.validate(req.body);
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    if (bodyValue.student_id) await checkStudentExists(bodyValue.student_id);
    if (bodyValue.lesson_id) await checkLessonExists(bodyValue.lesson_id);

    const keys = Object.keys(bodyValue);
    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = Object.values(bodyValue);

    const result = await pool.query(
      `UPDATE student_lesson SET ${updates} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, idValue.id]
    );

    if (!result.rowCount)
      return res.status(404).send({ message: "Student lesson not found" });

    res
      .status(200)
      .send({
        message: "Student lesson updated",
        studentLesson: result.rows[0],
      });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const deleteStudentLesson = async (req, res) => {
  try {
    const { error, value } = studentLessonIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query(
      "DELETE FROM student_lesson WHERE id = $1 RETURNING *",
      [value.id]
    );
    if (!result.rowCount)
      return res.status(404).send({ message: "Student lesson not found" });

    res
      .status(200)
      .send({
        message: "Student lesson deleted",
        studentLesson: result.rows[0],
      });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

module.exports = {
  addStudentLesson,
  getAllStudentLessons,
  getStudentLesson,
  updateStudentLesson,
  deleteStudentLesson,
};
