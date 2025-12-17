const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  contactNumber: { type: String, required: true },
  orderQuantity: { type: Number, required: true, min: 1 },
  product: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending",
  },
  // GPS Tracking fields
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  driverLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  customerLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  customerAddress: { type: String }
}, { timestamps: true });

const Delivery = mongoose.model("Delivery", deliverySchema);
module.exports = Delivery;