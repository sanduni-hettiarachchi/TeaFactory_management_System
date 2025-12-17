const Route = require("../model/Route");

// @desc   Create new route
// @route  POST /api/routes
const createRoute = async (req, res) => {
  try {
    const route = new Route(req.body);
    const savedRoute = await route.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "This route name already exists" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// @desc   Get all routes
// @route  GET /api/routes
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get route by ID
// @route  GET /api/routes/:id
const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update route
// @route  PUT /api/routes/:id
const updateRoute = async (req, res) => {
  try {
    // Check if name is being changed and if it conflicts with another route
    if (req.body.name) {
      const existingRoute = await Route.findOne({ 
        name: req.body.name,
        _id: { $ne: req.params.id } // Exclude current route from check
      });
      
      if (existingRoute) {
        return res.status(400).json({ message: "This route name already exists" });
      }
    }
    
    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedRoute) {
      return res.status(404).json({ message: "Route not found" });
    }
    
    res.json(updatedRoute);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "This route name already exists" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// @desc   Delete route
// @route  DELETE /api/routes/:id
const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRoute = createRoute;
exports.getRoutes = getRoutes;
exports.getRouteById = getRouteById;
exports.updateRoute = updateRoute;
exports.deleteRoute = deleteRoute;