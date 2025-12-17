const Driver = require("../model/Driver");

// @desc   Create new driver
// @route  POST /api/drivers
const createDriver = async (req, res) => {
  try {
    const driver = new Driver(req.body);
    const savedDriver = await driver.save();
    res.status(201).json(savedDriver);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `This ${field} is already registered` });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// @desc   Get all drivers
// @route  GET /api/drivers
const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .populate('vehicleId', 'type number')
      .populate('routeId', 'name area');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get driver by ID
// @route  GET /api/drivers/:id
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('vehicleId')
      .populate('routeId');
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update driver
// @route  PUT /api/drivers/:id
const updateDriver = async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vehicleId').populate('routeId');
    
    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json(updatedDriver);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `This ${field} is already registered` });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// @desc   Delete driver
// @route  DELETE /api/drivers/:id
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver
};