const express = require("express");
const contactRouter = express.Router();
const Contact = require("../model/Contact");

// @route   POST /api/contact
// @desc    Save contact form data
contactRouter.post("/add", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

module.exports = contactRouter;
