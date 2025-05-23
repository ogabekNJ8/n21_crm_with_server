const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/", paymentController.addPayment);
router.get("/", paymentController.getAllPayments);
router.get("/:id", paymentController.getPayment);
router.patch("/:id", paymentController.updatePayment);
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
