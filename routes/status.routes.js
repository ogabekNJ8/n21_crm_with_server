const router = require("express").Router();
const {
  addStatus,
  getAllStatuses,
  getStatus,
  updateStatus,
  deleteStatus,
} = require("../controllers/status.controller");

router.post("/", addStatus);
router.get("/", getAllStatuses);
router.get("/:id", getStatus);
router.patch("/:id", updateStatus);
router.delete("/:id", deleteStatus);

module.exports = router;
