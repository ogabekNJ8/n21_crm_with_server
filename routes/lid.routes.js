const router = require("express").Router();
const {
  addLid,
  getAllLids,
  getLid,
  updateLid,
  deleteLid,
} = require("../controllers/lid.controller");

router.post("/", addLid);
router.get("/", getAllLids);
router.get("/:id", getLid);
router.patch("/:id", updateLid);
router.delete("/:id", deleteLid);

module.exports = router;
