const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  lookingFor: {
    type: String,
    enum: ["Our Brands", "Collaboration Opportunities", "Certifications and Compliance", "Something Else"],
    required: true,
  },
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  phone: {
    type: String,
    required: true,
    match: [/^0\d{9}$/, "Phone must start with 0 and be exactly 10 digits"],
  },
  email: { type: String, required: true, match: [/\S+@\S+\.\S+/, "Invalid email"] },
  country: { type: String, required: true },
  company: { type: String, required: true },
  subject: { type: String, required: true },
  question: { type: String, required: true, minlength: 10, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);
module.exports = Inquiry
