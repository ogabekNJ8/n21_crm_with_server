const router = require("express").Router();
const {
  addDeviceToken,
  getAllDeviceTokens,
  getDeviceToken,
  updateDeviceToken,
  deleteDeviceToken,
} = require("../controllers/device.controller");

router.post("/", addDeviceToken);
router.get("/", getAllDeviceTokens);
router.get("/:id", getDeviceToken);
router.patch("/:id", updateDeviceToken);
router.delete("/:id", deleteDeviceToken);

module.exports = router;
