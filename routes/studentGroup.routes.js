const express = require("express");
const router = express.Router();
const {
  addStudentGroup,
  getAllStudentGroups,
  getStudentGroup,
  updateStudentGroup,
  deleteStudentGroup,
} = require("../controllers/studentGroup.controller");

router.post("/", addStudentGroup);
router.get("/", getAllStudentGroups);
router.get("/:id", getStudentGroup);
router.patch("/:id", updateStudentGroup);
router.delete("/:id", deleteStudentGroup);

module.exports = router;
