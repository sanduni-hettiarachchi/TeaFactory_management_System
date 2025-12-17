const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Van', 'Truck', 'Car', 'Motorcycle', 'Bicycle']
  },
  number: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  capacity: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'maintenance', 'in-use'],
    default: 'available'
  }
}, { 
  timestamps: true 
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports =  Vehicle;