const router = require("express").Router();
const stageRouter = require("./stage.routes");
const statusRouter = require("./status.routes");
const reasonRouter = require("./reason.routes");
const roleRouter = require("./role.routes");


router.use("/stage", stageRouter);
router.use("/status", statusRouter);
router.use("/reason", reasonRouter);
router.use("/role", roleRouter);


module.exports = router;
