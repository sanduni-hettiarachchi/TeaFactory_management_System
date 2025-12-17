const Vehicle = require("../model/Vehicle");

// @desc   Create new vehicle
// @route  POST /api/vehicles
const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "This vehicle number is already registered" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// @desc   Get all vehicles
// @route  GET /api/vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get vehicle by ID
// @route  GET /api/vehicles/:id
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update vehicle
// @route  PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(updatedVehicle);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "This vehicle number is already registered" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// @desc   Delete vehicle
// @route  DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVehicle = createVehicle;
exports.getVehicles = getVehicles;
exports.getVehicleById = getVehicleById;
exports.updateVehicle = updateVehicle;
exports.deleteVehicle = deleteVehicle