const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MachineSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive", "maintenance"], // optional safeguard
    default: "active",
  },
}, {
  timestamps: true, // adds createdAt and updatedAt automatically
});

// ✅ Fix: Prevent OverwriteModelError on hot reload
const Machine = mongoose.model("Machine", MachineSchema);
module.exports = Machine
