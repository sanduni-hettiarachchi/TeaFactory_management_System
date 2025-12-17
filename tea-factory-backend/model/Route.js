const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  stops: {
    type: Number,
    min: 1,
    max: 100
  },
  distance: {
    type: String,
    trim: true
  },
  estimatedTime: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true 
});

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;