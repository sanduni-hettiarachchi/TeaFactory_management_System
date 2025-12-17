const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  companyName: { type: String, required: true, trim: true },
  contactPerson: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
    match: [/^(0\d{9}|\+\d{1,3}\d{6,14})$/, "Enter valid phone number"],
  },
  address: { type: String, required: true, trim: true },
  country: { type: String, required: true },
  businessType: {
    type: String,
    enum: ["Foriegn Buyer", "Export Partner", "Local Buyer", "Retailer", "Hotel/Restaurant", "Other"],
    required: true,
  },
  teaProducts: [{ type: String }], // multiple selection allowed
  monthlyRequirement: { type: Number, required: true, min: 1 },
  additionalNotes: { type: String },
  status: { type: String, enum: ["Unregistered", "Registered"], default: "Unregistered" },
  createdAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
