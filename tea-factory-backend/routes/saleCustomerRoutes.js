const express = require("express");
const router = express.Router();
const Customers = require("../model/Customer");

// Simple logger for this router
router.use((req, _res, next) => {
  console.log(`[customers] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Register a new customer email
router.post("/register", async (req, res) => {
  try {
    const { email, name, phone } = req.body || {};
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });
    const existing = await Customers.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) return res.status(409).json({ success: false, error: "Email already registered" });
    const customer = await Customers.create({ email: String(email).toLowerCase().trim(), name, phone });
    return res.json({ success: true, customer });
  } catch (err) {
    console.error("register customer error:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// Login by email (only if registered)
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });
    const customer = await Customers.findOne({ email: String(email).toLowerCase().trim() });
    if (!customer) return res.status(404).json({ success: false, error: "Email not registered" });
    return res.json({ success: true, customer });
  } catch (err) {
    console.error("login customer error:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// Check if email exists
router.get("/:email", async (req, res) => {
  try {
    const email = String(req.params.email || "").toLowerCase().trim();
    const customer = await Customers.findOne({ email });
    return res.json({ success: true, exists: !!customer });
  } catch (err) {
    console.error("get customer error:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

module.exports = router;
