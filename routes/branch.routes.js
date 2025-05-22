const router = require("express").Router();
const {
  addBranch,
  getAllBranches,
  getBranch,
  deleteBranch,
  updateBranch,
} = require("../controllers/branch.controller");

router.post("/", addBranch);
router.get("/", getAllBranches);
router.get("/:id", getBranch);
router.patch("/:id", updateBranch);
router.delete("/:id", deleteBranch);

module.exports = router;
