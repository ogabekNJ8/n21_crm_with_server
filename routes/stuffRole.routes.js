const router = require("express").Router();
const {
  addStuffRole,
  getAllStuffRoles,
  getStuffRole,
  updateStuffRole,
  deleteStuffRole,
} = require("../controllers/stuffRole.controller");

router.post("/", addStuffRole);
router.get("/", getAllStuffRoles);
router.get("/:id", getStuffRole);
router.patch("/:id", updateStuffRole);
router.delete("/:id", deleteStuffRole);

module.exports = router;
