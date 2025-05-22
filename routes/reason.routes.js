const router = require("express").Router();
const {
  addReason,
  getAllReasons,
  getReason,
  updateReason,
  deleteReason,
} = require("../controllers/reason.controller");

router.post("/", addReason);
router.get("/", getAllReasons);
router.get("/:id", getReason);
router.put("/:id", updateReason);
router.delete("/:id", deleteReason);

module.exports = router;
