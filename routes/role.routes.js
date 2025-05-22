const router = require("express").Router();
const {
  addRole,
  getRole,
  getAllRoles,
  updateRole,
  deleteRole,
} = require("../controllers/role.controller");

router.post("/", addRole);
router.get("/", getAllRoles);
router.get("/:id", getRole);
router.patch("/:id", updateRole);
router.delete("/:id", deleteRole);

module.exports = router;
