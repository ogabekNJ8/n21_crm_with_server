const express = require("express");
const router = express.Router();
const {
  addLesson,
  getAllLessons,
  getLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controller");

router.post("/", addLesson);
router.get("/", getAllLessons);
router.get("/:id", getLesson);
router.patch("/:id", updateLesson);
router.delete("/:id", deleteLesson);

module.exports = router;
