const express = require("express");
const inquiryRouter = express.Router();
const Inquiry = require("../model/Inquiry");

// POST /api/inquiry
inquiryRouter.post("/add", async (req, res) => {
  try {
    const { lookingFor, name, phone, email, country, company, subject, question } = req.body;

    if (!lookingFor || !name || !phone || !email || !country || !company || !subject || !question) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save inquiry
    const newInquiry = new Inquiry({ lookingFor, name, phone, email, country, company, subject, question });
    await newInquiry.save();

    res.status(201).json({ success: true, message: "Inquiry submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

module.exports = inquiryRouter;
