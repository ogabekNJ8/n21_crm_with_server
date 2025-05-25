const express = require("express");
const router = express.Router();
const {
  addStudentLesson,
  getAllStudentLessons,
  getStudentLesson,
  updateStudentLesson,
  deleteStudentLesson,
} = require("../controllers/studentLesson.controller");

router.post("/", addStudentLesson);
router.get("/", getAllStudentLessons);
router.get("/:id", getStudentLesson);
router.patch("/:id", updateStudentLesson);
router.delete("/:id", deleteStudentLesson);

module.exports = router;
