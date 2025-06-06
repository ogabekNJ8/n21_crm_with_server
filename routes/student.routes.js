const express = require("express");
const router = express.Router();
const {
  addStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");

router.post("/", addStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudent);
router.patch("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
