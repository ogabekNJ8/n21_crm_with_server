const router = require("express").Router();
const {
  addStuff,
  getAllStuffs,
  getStuff,
  updateStuff,
  deleteStuff,
} = require("../controllers/stuff.controller");

router.post("/", addStuff);
router.get("/", getAllStuffs);
router.get("/:id", getStuff);
router.patch("/:id", updateStuff);
router.delete("/:id", deleteStuff);

module.exports = router;
