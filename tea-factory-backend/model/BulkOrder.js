const mongoose = require("mongoose");

const BulkOrderSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    email: { type: String },
    contactNumber: { type: String, required: true },
    teaType: { type: String, required: true },
    packaging: { type: String, required: true },
    quantityKg: { type: Number, required: true, min: 50 },
    deliveryDate: { type: Date },
    notes: { type: String },
    documents: [
      {
        originalName: String,
        mimeType: String,
        size: Number,
      },
    ],
    status: { type: String, enum: ["Submitted", "Approved", "Rejected"], default: "Submitted" },
    statusReason: { type: String },
  },
  { timestamps: true }
);

const BulkOrder = mongoose.model("BulkOrder", BulkOrderSchema);
module.exports = BulkOrder