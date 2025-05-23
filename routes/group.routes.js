const router = require("express").Router();
const {
  addGroup,
  getAllGroups,
  getGroup,
  updateGroup,
  deleteGroup,
} = require("../controllers/group.controller");

router.post("/", addGroup);
router.get("/", getAllGroups);
router.get("/:id", getGroup);
router.patch("/:id", updateGroup);
router.delete("/:id", deleteGroup);

module.exports = router;
