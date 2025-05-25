const pool = require("../config/db");
const { sendErrorresponse } = require("../helpers/send_error_response");
const {
  lessonSchema,
  updateLessonSchema,
  lessonIdSchema,
} = require("../validations/lesson.validation");

const checkGroupExists = async (group_id) => {
  const result = await pool.query('SELECT id FROM "group" WHERE id = $1', [
    group_id,
  ]);
  if (!result.rowCount) throw new Error("Group not found");
};

const addLesson = async (req, res) => {
  try {
    const { error, value } = lessonSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    await checkGroupExists(value.group_id);

    const result = await pool.query(
      `INSERT INTO "lesson" (lesson_theme, lesson_number, group_id, lesson_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        value.lesson_theme,
        value.lesson_number,
        value.group_id,
        value.lesson_date,
      ]
    );

    res.status(201).send({ message: "Lesson created", lesson: result.rows[0] });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const getAllLessons = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "lesson"');
    res.status(200).send(result.rows);
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const getLesson = async (req, res) => {
  try {
    const { error, value } = lessonIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query('SELECT * FROM "lesson" WHERE id = $1', [
      value.id,
    ]);
    if (!result.rowCount)
      return res.status(404).send({ message: "Lesson not found" });

    res.status(200).send(result.rows[0]);
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const updateLesson = async (req, res) => {
  try {
    const { error: idError, value: idValue } = lessonIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).send({ message: idError.details[0].message });

    const { error: bodyError, value: bodyValue } = updateLessonSchema.validate(
      req.body
    );
    if (bodyError)
      return res.status(400).send({ message: bodyError.details[0].message });

    if (bodyValue.group_id) await checkGroupExists(bodyValue.group_id);

    const keys = Object.keys(bodyValue);
    const updates = keys.map((key, i) => `"${key}" = $${i + 1}`).join(", ");
    const values = Object.values(bodyValue);

    const result = await pool.query(
      `UPDATE "lesson" SET ${updates} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, idValue.id]
    );

    if (!result.rowCount)
      return res.status(404).send({ message: "Lesson not found" });

    res.status(200).send({ message: "Lesson updated", lesson: result.rows[0] });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { error, value } = lessonIdSchema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await pool.query(
      'DELETE FROM "lesson" WHERE id = $1 RETURNING *',
      [value.id]
    );
    if (!result.rowCount)
      return res.status(404).send({ message: "Lesson not found" });

    res.status(200).send({ message: "Lesson deleted", lesson: result.rows[0] });
  } catch (err) {
    sendErrorresponse(err, res);
  }
};

module.exports = {
  addLesson,
  getAllLessons,
  getLesson,
  updateLesson,
  deleteLesson,
};
