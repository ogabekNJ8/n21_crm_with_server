const router = require("express").Router();
const {
  addStage,
  getStage,
  getAllStages,
  updateStage,
  deleteStage,
} = require("../controllers/stage.controller");

router.post("/", addStage);
router.get("/", getAllStages);
router.get("/:id", getStage);
router.patch("/:id", updateStage);
router.delete("/:id", deleteStage);

module.exports = router;
