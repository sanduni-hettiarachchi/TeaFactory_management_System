const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

const Customers = mongoose.model("Customers", CustomerSchema);
module.exports = Customers