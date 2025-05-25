const router = require("express").Router();

const stageRouter = require("./stage.routes");
const statusRouter = require("./status.routes");
const reasonRouter = require("./reason.routes");
const roleRouter = require("./role.routes");
const branchRouter = require("./branch.routes");
const groupRouter = require("./group.routes");
const deviceRouter = require("./device.routes");
const lidRouter = require("./lid.routes");
const studentRouter = require("./student.routes");
const paymentRouter = require("./payment.routes");
const studentGroupRouter = require("./studentGroup.routes");
const lessonRouter = require("./lesson.routes");
const studentLessonRouter = require("./studentLesson.routes");


router.use("/stage", stageRouter);
router.use("/status", statusRouter);
router.use("/reason", reasonRouter);
router.use("/role", roleRouter);
router.use("/branch", branchRouter);
router.use("/group", groupRouter);
router.use("/device", deviceRouter);
router.use("/lid", lidRouter);
router.use("/student", studentRouter);
router.use("/payment", paymentRouter);
router.use("/student_group", studentGroupRouter);
router.use("/lesson", lessonRouter);
router.use("/student_lesson", studentLessonRouter);

module.exports = router;
