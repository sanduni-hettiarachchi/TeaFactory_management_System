const express = require("express");
const { sendSupplierEmail } = require("../controllers/gmailController");
const router = express.Router();

// ✅ Send Supplier Email Route
router.post("/send-supplier-email", sendSupplierEmail);

module.exports = router;
