const router = require("express").Router();
const {
  addGroupStuff,
  getAllGroupStuff,
  getGroupStuff,
  updateGroupStuff,
  deleteGroupStuff,
} = require("../controllers/groupStuff.controller");

router.post("/", addGroupStuff);
router.get("/", getAllGroupStuff);
router.get("/:id", getGroupStuff);
router.patch("/:id", updateGroupStuff);
router.delete("/:id", deleteGroupStuff);

module.exports = router;
