// Enhanced Drivers Page with Validation and Live GPS Tracking
import React, { useEffect, useState } from "react";
import LiveGPSTracking from "./LiveGPSTracking";

const DRIVERS_STORAGE_KEY = "dms_drivers_v1";
const VEHICLES_STORAGE_KEY = "dms_vehicles_v1";
const ROUTES_STORAGE_KEY = "dms_routes_v1";
const DELIVERIES_STORAGE_KEY = "dms_deliveries_v1";

function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function DriversPageValidated() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [mapView, setMapView] = useState(true);
  
  // Form states
  const [driverForm, setDriverForm] = useState({ 
    name: "", license: "", phone: "", email: "", vehicleId: "", routeId: "" 
  });
  const [vehicleForm, setVehicleForm] = useState({ 
    type: "", number: "", capacity: "", status: "available" 
  });
  const [routeForm, setRouteForm] = useState({ 
    name: "", area: "", stops: "", distance: "", estimatedTime: "" 
  });
  
  // Edit states
  const [editDriverId, setEditDriverId] = useState(null);
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [editRouteId, setEditRouteId] = useState(null);
  
  // Modal states
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  
  // Validation error states
  const [driverErrors, setDriverErrors] = useState({});
  const [vehicleErrors, setVehicleErrors] = useState({});
  const [routeErrors, setRouteErrors] = useState({});
  
  // Success/Error message states
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [driverStatusFilter, setDriverStatusFilter] = useState("All"); // All, Active, Inactive, On Delivery

  // Load data from localStorage or API
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load from API first (MongoDB)
      const [driversRes, vehiclesRes, routesRes, deliveriesRes] = await Promise.all([
        fetch("http://localhost:3001/api/drivers").catch(() => null),
        fetch("http://localhost:3001/api/vehicles").catch(() => null),
        fetch("http://localhost:3001/api/routes").catch(() => null),
        fetch("http://localhost:3001/api/deliveries").catch(() => null)
      ]);

      // Load drivers
      if (driversRes?.ok) {
        const driversData = await driversRes.json();
        setDrivers(driversData);
        localStorage.setItem(DRIVERS_STORAGE_KEY, JSON.stringify(driversData));
      } else {
        const localDrivers = JSON.parse(localStorage.getItem(DRIVERS_STORAGE_KEY)) || [];
        setDrivers(localDrivers);
      }

      // Load vehicles
      if (vehiclesRes?.ok) {
        const vehiclesData = await vehiclesRes.json();
        setVehicles(vehiclesData);
        localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehiclesData));
      } else {
        const localVehicles = JSON.parse(localStorage.getItem(VEHICLES_STORAGE_KEY)) || [];
        setVehicles(localVehicles);
      }

      // Load routes
      if (routesRes?.ok) {
        const routesData = await routesRes.json();
        setRoutes(routesData);
        localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(routesData));
      } else {
        const localRoutes = JSON.parse(localStorage.getItem(ROUTES_STORAGE_KEY)) || [];
        setRoutes(localRoutes);
      }

      // Load deliveries
      if (deliveriesRes?.ok) {
        const deliveriesData = await deliveriesRes.json();
        setDeliveries(deliveriesData);
        localStorage.setItem(DELIVERIES_STORAGE_KEY, JSON.stringify(deliveriesData));
      } else {
        const localDeliveries = JSON.parse(localStorage.getItem(DELIVERIES_STORAGE_KEY)) || [];
        setDeliveries(localDeliveries);
      }

      console.log('📊 Data loaded from MongoDB:', {
        drivers: drivers.length,
        vehicles: vehicles.length,
        routes: routes.length
      });
    } catch (error) {
      console.error("Error loading data:", error);
      showMessage("error", "Failed to load data from server");
    }
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (drivers.length > 0 || vehicles.length > 0 || routes.length > 0) {
      localStorage.setItem(DRIVERS_STORAGE_KEY, JSON.stringify(drivers));
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
      localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(routes));
      localStorage.setItem(DELIVERIES_STORAGE_KEY, JSON.stringify(deliveries));
      
      console.log('💾 Data saved to localStorage:', {
        drivers: drivers.length,
        vehicles: vehicles.length,
        routes: routes.length,
        deliveries: deliveries.length
      });
    }
  }, [drivers, vehicles, routes, deliveries]);

  // Show message helper
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  // ========== VALIDATION FUNCTIONS ==========
  
  // Driver validation
  const validateDriver = (data) => {
    const errors = {};
    
    // Name validation
    if (!data.name || data.name.trim().length === 0) {
      errors.name = "Driver name is required";
    } else if (data.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    } else if (data.name.trim().length > 50) {
      errors.name = "Name must be less than 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(data.name)) {
      errors.name = "Name can only contain letters and spaces";
    }
    
    // License validation
    if (!data.license || data.license.trim().length === 0) {
      errors.license = "License number is required";
    } else if (data.license.trim().length < 5) {
      errors.license = "License number must be at least 5 characters";
    } else if (!/^[A-Z0-9-]+$/i.test(data.license)) {
      errors.license = "License can only contain letters, numbers, and hyphens";
    } else {
      // Check for duplicate license (excluding current driver if editing)
      const duplicate = drivers.find(d => 
        d.license.toLowerCase() === data.license.toLowerCase() && 
        d.id !== editDriverId
      );
      if (duplicate) {
        errors.license = "This license number is already registered";
      }
    }
    
    // Phone validation
    if (!data.phone || data.phone.trim().length === 0) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]+$/.test(data.phone)) {
      errors.phone = "Invalid phone number format";
    } else {
      const digitsOnly = data.phone.replace(/[^0-9]/g, '');
      if (digitsOnly.length < 10) {
        errors.phone = "Phone number must have at least 10 digits";
      } else if (digitsOnly.length > 15) {
        errors.phone = "Phone number cannot exceed 15 digits";
      } else {
        // Check for duplicate phone
        const duplicate = drivers.find(d => 
          d.phone === data.phone && (d._id !== editDriverId && d.id !== editDriverId)
        );
        if (duplicate) {
          errors.phone = "This phone number is already registered";
        }
      }
    }
    
    // Email validation (optional but must be valid if provided)
    if (data.email && data.email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "Invalid email format";
      } else {
        // Check for duplicate email
        const duplicate = drivers.find(d => 
          d.email && d.email.toLowerCase() === data.email.toLowerCase() && 
          (d._id !== editDriverId && d.id !== editDriverId)
        );
        if (duplicate) {
          errors.email = "This email is already registered";
        }
      }
    }
    
    // Vehicle validation
    if (data.vehicleId) {
      const vehicle = vehicles.find(v => v._id === data.vehicleId || v.id === data.vehicleId);
      if (!vehicle) {
        errors.vehicleId = "Selected vehicle does not exist";
      } else if (vehicle.status !== 'available') {
        errors.vehicleId = "Selected vehicle is not available";
      } else {
        // Check if vehicle is already assigned to another driver
        const assignedDriver = drivers.find(d => 
          (d.vehicleId === data.vehicleId || d.vehicleId?._id === data.vehicleId) && 
          (d._id !== editDriverId && d.id !== editDriverId)
        );
        if (assignedDriver) {
          errors.vehicleId = `Vehicle already assigned to ${assignedDriver.name}`;
        }
      }
    }
    
    // Route validation
    if (data.routeId) {
      const route = routes.find(r => r._id === data.routeId || r.id === data.routeId);
      if (!route) {
        errors.routeId = "Selected route does not exist";
      }
    }
    
    return errors;
  };

  // Vehicle validation
  const validateVehicle = (data) => {
    const errors = {};
    
    // Type validation
    if (!data.type || data.type.trim().length === 0) {
      errors.type = "Vehicle type is required";
    }
    
    // Number validation
    if (!data.number || data.number.trim().length === 0) {
      errors.number = "Vehicle number is required";
    } else if (data.number.trim().length < 3) {
      errors.number = "Vehicle number must be at least 3 characters";
    } else if (!/^[A-Z0-9-]+$/i.test(data.number)) {
      errors.number = "Vehicle number can only contain letters, numbers, and hyphens";
    } else {
      // Check for duplicate vehicle number
      const duplicate = vehicles.find(v => 
        v.number.toLowerCase() === data.number.toLowerCase() && 
        v.id !== editVehicleId
      );
      if (duplicate) {
        errors.number = "This vehicle number is already registered";
      }
    }
    
    // Capacity validation
    if (data.capacity && data.capacity.trim().length > 0) {
      if (!/^[0-9]+\s*(kg|ton|tons|lbs)?$/i.test(data.capacity)) {
        errors.capacity = "Invalid capacity format (e.g., 500kg, 2 tons)";
      }
    }
    
    // Status validation
    if (!data.status) {
      errors.status = "Vehicle status is required";
    }
    
    return errors;
  };

  // Route validation
  const validateRoute = (data) => {
    const errors = {};
    
    // Name validation
    if (!data.name || data.name.trim().length === 0) {
      errors.name = "Route name is required";
    } else if (data.name.trim().length < 3) {
      errors.name = "Route name must be at least 3 characters";
    } else if (data.name.trim().length > 100) {
      errors.name = "Route name must be less than 100 characters";
    } else {
      // Check for duplicate route name
      const duplicate = routes.find(r => 
        r.name.toLowerCase() === data.name.toLowerCase() && 
        (r._id || r.id) !== editRouteId
      );
      if (duplicate) {
        errors.name = "This route name already exists";
      }
    }
    
    // Area validation
    if (!data.area || data.area.trim().length === 0) {
      errors.area = "Area is required";
    } else if (data.area.trim().length < 3) {
      errors.area = "Area must be at least 3 characters";
    }
    
    // Stops validation
    if (data.stops && data.stops.trim().length > 0) {
      const stopsNum = parseInt(data.stops);
      if (isNaN(stopsNum) || stopsNum < 1) {
        errors.stops = "Number of stops must be at least 1";
      } else if (stopsNum > 100) {
        errors.stops = "Number of stops cannot exceed 100";
      }
    }
    
    // Distance validation
    if (data.distance && data.distance.trim().length > 0) {
      if (!/^[0-9.]+\s*(km|miles|mi)?$/i.test(data.distance)) {
        errors.distance = "Invalid distance format (e.g., 15km, 10 miles)";
      }
    }
    
    // Estimated time validation
    if (data.estimatedTime && data.estimatedTime.trim().length > 0) {
      if (!/^[0-9.]+\s*(min|mins|minutes|hour|hours|hr|hrs)?$/i.test(data.estimatedTime)) {
        errors.estimatedTime = "Invalid time format (e.g., 30 mins, 2 hours)";
      }
    }
    
    return errors;
  };

  // ========== DRIVER CRUD OPERATIONS ==========
  
  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateDriver(driverForm);
    setDriverErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      showMessage("error", "Please fix the validation errors");
      return;
    }
    
    try {
      if (editDriverId) {
        // Update existing driver in MongoDB
        const response = await fetch(`http://localhost:3001/api/drivers/${editDriverId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(driverForm)
        });
        
        if (response.ok) {
          const updatedDriver = await response.json();
          setDrivers(drivers.map(d => (d._id === editDriverId || d.id === editDriverId) ? updatedDriver : d));
          showMessage("success", "Driver updated successfully!");
          setEditDriverId(null);
        } else {
          const error = await response.json();
          showMessage("error", error.message || "Failed to update driver");
          return;
        }
      } else {
        // Create new driver in MongoDB
        const response = await fetch('http://localhost:3001/api/drivers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(driverForm)
        });
        
        if (response.ok) {
          const savedDriver = await response.json();
          setDrivers((prev) => [...prev, savedDriver]);
          showMessage("success", "Driver added successfully!");
        } else {
          const error = await response.json();
          showMessage("error", error.message || "Failed to add driver");
          return;
        }
      }
      
      setDriverForm({ name: "", license: "", phone: "", email: "", vehicleId: "", routeId: "" });
      setDriverErrors({});
    } catch (error) {
      console.error("Driver save error:", error);
      showMessage("error", "Failed to save driver");
    }
  };

  const handleEditDriver = (id) => {
    const driver = drivers.find((d) => d._id === id || d.id === id);
    if (driver) {
      setDriverForm({ 
        name: driver.name || '',
        license: driver.license || '',
        phone: driver.phone || '',
        email: driver.email || '',
        vehicleId: driver.vehicleId || '',
        routeId: driver.routeId || ''
      });
      setEditDriverId(driver._id || driver.id);
      setDriverErrors({});
      setMapView(false); // Switch to list view for editing
    }
  };

  const handleDeleteDriver = async (id) => {
    const driver = drivers.find(d => d._id === id || d.id === id);
    
    // Check if driver has active deliveries
    const activeDeliveries = deliveries.filter(d => 
      d.driverId === id && d.status === 'Out for Delivery'
    );
    
    if (activeDeliveries.length > 0) {
      showMessage("error", `Cannot delete driver with ${activeDeliveries.length} active deliveries`);
      return;
    }
    
    if (window.confirm(`Delete driver ${driver?.name}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/drivers/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setDrivers((prev) => prev.filter((d) => d._id !== id && d.id !== id));
          showMessage("success", "Driver deleted successfully");
          
          if (editDriverId === id) {
            setEditDriverId(null);
            setDriverForm({ name: "", license: "", phone: "", email: "", vehicleId: "", routeId: "" });
            setDriverErrors({});
          }
        } else {
          const error = await response.json();
          showMessage("error", error.message || "Failed to delete driver");
        }
      } catch (error) {
        console.error("Delete error:", error);
        showMessage("error", "Failed to delete driver");
      }
    }
  };

  // ========== VEHICLE CRUD OPERATIONS ==========
  
  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateVehicle(vehicleForm);
    setVehicleErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      showMessage("error", "Please fix the validation errors");
      return;
    }
    
    try {
      if (editVehicleId) {
        // Update existing vehicle in MongoDB
        const response = await fetch(`http://localhost:3001/api/vehicles/${editVehicleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicleForm)
        });
        
        if (response.ok) {
          const updatedVehicle = await response.json();
          setVehicles(vehicles.map(v => v._id === editVehicleId ? updatedVehicle : v));
          showMessage("success", "Vehicle updated successfully!");
          setEditVehicleId(null);
        } else {
          const error = await response.json();
          showMessage("error", error.message || "Failed to update vehicle");
          return;
        }
      } else {
        // Create new vehicle in MongoDB
        const response = await fetch('http://localhost:3001/api/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicleForm)
        });
        
        if (response.ok) {
          const savedVehicle = await response.json();
          setVehicles((prev) => [...prev, savedVehicle]);
          showMessage("success", "Vehicle added successfully!");
        } else {
          const error = await response.json();
          showMessage("error", error.message || "Failed to add vehicle");
          return;
        }
      }
      
      setVehicleForm({ type: "", number: "", capacity: "", status: "available" });
      setVehicleErrors({});
      setShowVehicleForm(false);
    } catch (error) {
      console.error("Vehicle save error:", error);
      showMessage("error", "Failed to save vehicle");
    }
  };

  const handleEditVehicle = (id) => {
    const vehicle = vehicles.find((v) => v._id === id || v.id === id);
    if (vehicle) {
      setVehicleForm({ 
        type: vehicle.type,
        number: vehicle.number,
        capacity: vehicle.capacity || '',
        status: vehicle.status
      });
      setEditVehicleId(vehicle._id || vehicle.id);
      setVehicleErrors({});
      setShowVehicleForm(true);
    }
  };

  const handleDeleteVehicle = async (id) => {
    const vehicle = vehicles.find(v => v._id === id || v.id === id);
    
    // Check if vehicle is assigned to any driver
    const assignedDriver = drivers.find(d => d.vehicleId === id);
    
    if (assignedDriver) {
      showMessage("error", `Cannot delete vehicle assigned to ${assignedDriver.name}`);
      return;
    }
    
    if (window.confirm(`Delete vehicle ${vehicle?.number}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/vehicles/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setVehicles((prev) => prev.filter((v) => v._id !== id && v.id !== id));
          showMessage("success", "Vehicle deleted successfully");
        } else {
          const error = await response.json();
          showMessage("error", error.message || "Failed to delete vehicle");
        }
      } catch (error) {
        console.error("Delete error:", error);
        showMessage("error", "Failed to delete vehicle");
      }
    }
  };

  // ========== ROUTE CRUD OPERATIONS ==========
  
  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    
    console.log("🔧 Route Submit - editRouteId:", editRouteId);
    console.log("🔧 Route Form Data:", routeForm);
    
    // Validate form
    const errors = validateRoute(routeForm);
    setRouteErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      console.log("❌ Validation errors:", errors);
      showMessage("error", "Please fix the validation errors");
      return;
    }
    
    try {
      if (editRouteId) {
        // Update existing route in MongoDB
        console.log("📤 Updating route:", editRouteId);
        
        // Prepare the data - convert stops to number if it's a string
        const updateData = {
          ...routeForm,
          stops: routeForm.stops ? parseInt(routeForm.stops) : undefined
        };
        
        console.log("📤 Update payload:", updateData);
        
        const response = await fetch(`http://localhost:3001/api/routes/${editRouteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        
        console.log("📥 Response status:", response.status);
        
        if (response.ok) {
          const updatedRoute = await response.json();
          console.log("✅ Route updated:", updatedRoute);
          setRoutes(routes.map(r => (r._id || r.id) === editRouteId ? updatedRoute : r));
          showMessage("success", "Route updated successfully!");
          setEditRouteId(null);
          setRouteForm({ name: "", area: "", stops: "", distance: "", estimatedTime: "" });
          setRouteErrors({});
          setShowRouteForm(false);
        } else {
          const error = await response.json();
          console.error("❌ Update failed:", error);
          showMessage("error", error.message || "Failed to update route");
          return;
        }
      } else {
        // Create new route in MongoDB
        const createData = {
          ...routeForm,
          stops: routeForm.stops ? parseInt(routeForm.stops) : undefined
        };
        
        const response = await fetch('http://localhost:3001/api/routes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData)
        });
        
        if (response.ok) {
          const savedRoute = await response.json();
          setRoutes((prev) => [...prev, savedRoute]);
          showMessage("success", "Route added successfully!");
          setRouteForm({ name: "", area: "", stops: "", distance: "", estimatedTime: "" });
          setRouteErrors({});
          setShowRouteForm(false);
        } else {
          const error = await response.json();
          showMessage("error", error.message || "Failed to add route");
          return;
        }
      }
    } catch (error) {
      console.error("❌ Route save error:", error);
      showMessage("error", `Failed to save route: ${error.message}`);
    }
  };

  const handleEditRoute = (id) => {
    const route = routes.find((r) => r._id === id || r.id === id);
    if (route) {
      setRouteForm({ 
        name: route.name,
        area: route.area,
        stops: route.stops || '',
        distance: route.distance || '',
        estimatedTime: route.estimatedTime || ''
      });
      setEditRouteId(route._id || route.id);
      setRouteErrors({});
      setShowRouteForm(true);
    }
  };

  const handleDeleteRoute = async (id) => {
    const route = routes.find(r => r._id === id || r.id === id);
    
    // Check if route is assigned to any driver
    const assignedDrivers = drivers.filter(d => d.routeId === id);
    
    if (assignedDrivers.length > 0) {
      showMessage("error", `Cannot delete route assigned to ${assignedDrivers.length} driver(s)`);
      return;
    }
    
    if (window.confirm(`Delete route ${route?.name}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/routes/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setRoutes((prev) => prev.filter((r) => r._id !== id && r.id !== id));
          showMessage("success", "Route deleted successfully");
        } else {
          const error = await response.json();
          showMessage("error", error.message || "Failed to delete route");
        }
      } catch (error) {
        console.error("Delete error:", error);
        showMessage("error", "Failed to delete route");
      }
    }
  };

  // Update driver location from GPS tracking
  const handleUpdateLocation = (driverId, location) => {
    const updatedDeliveries = deliveries.map(delivery => {
      if (delivery.driverId === driverId) {
        return { ...delivery, driverLocation: location };
      }
      return delivery;
    });
    setDeliveries(updatedDeliveries);
  };

  // Helper functions
  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v._id === vehicleId || v.id === vehicleId);
    return vehicle ? `${vehicle.type} - ${vehicle.number}` : "Not assigned";
  };

  const getRouteName = (routeId) => {
    const route = routes.find(r => r._id === routeId || r.id === routeId);
    return route ? `${route.name} - ${route.area}` : "Not assigned";
  };

  const getDriverStats = () => {
    return {
      totalDrivers: drivers.length,
      assignedDrivers: drivers.filter(d => d.vehicleId && d.routeId).length,
      availableVehicles: vehicles.filter(v => v.status === 'available').length,
      activeRoutes: routes.length,
      activeDeliveries: deliveries.filter(d => d.status === 'Out for Delivery').length
    };
  };

  const stats = getDriverStats();
  const filteredDrivers = drivers.filter(driver => {
    // Search filter
    const matchesSearch = driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.license?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = driverStatusFilter === "All" || 
      (driverStatusFilter === "Active" && driver.status === "active") ||
      (driverStatusFilter === "Inactive" && driver.status === "inactive") ||
      (driverStatusFilter === "On Delivery" && driver.status === "on-delivery");
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Global Message */}
        {message.text && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-fade-in ${
            message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
              <span className="font-semibold">{message.text}</span>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚚 Driver Management & GPS Tracking</h1>
              <p className="text-gray-600 mt-2">Real-time driver locations with validated data integrity</p>
            </div>
            <button
              onClick={() => setMapView(!mapView)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg"
            >
              <span>{mapView ? "📋" : "🗺️"}</span>
              {mapView ? "Show Driver List" : "Show Live GPS Map"}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Drivers</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalDrivers}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">Assigned</h3>
            <p className="text-3xl font-bold text-green-600">{stats.assignedDrivers}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">Vehicles</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.availableVehicles}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">Routes</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.activeRoutes}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">Active Deliveries</h3>
            <p className="text-3xl font-bold text-red-600">{stats.activeDeliveries}</p>
          </div>
        </div>

        {mapView ? (
          /* Live GPS Tracking Map View */
          <LiveGPSTracking 
            drivers={drivers}
            deliveries={deliveries}
            onUpdateLocation={handleUpdateLocation}
          />
        ) : (
          /* Driver Management List View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Driver Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editDriverId ? "✏️ Edit Driver" : "➕ Add Driver"}
                </h2>
                <form onSubmit={handleDriverSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driver Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={driverForm.name}
                      onChange={(e) => {
                        setDriverForm({...driverForm, name: e.target.value});
                        if (driverErrors.name) setDriverErrors({...driverErrors, name: ""});
                      }}
                      placeholder="John Doe"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        driverErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {driverErrors.name && (
                      <p className="text-red-500 text-sm mt-1">⚠️ {driverErrors.name}</p>
                    )}
                  </div>

                  {/* License Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={driverForm.license}
                      onChange={(e) => {
                        setDriverForm({...driverForm, license: e.target.value.toUpperCase()});
                        if (driverErrors.license) setDriverErrors({...driverErrors, license: ""});
                      }}
                      placeholder="DL-12345"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        driverErrors.license ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {driverErrors.license && (
                      <p className="text-red-500 text-sm mt-1">⚠️ {driverErrors.license}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={driverForm.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow if digits count is 15 or less
                        const digitsOnly = value.replace(/[^0-9]/g, '');
                        if (digitsOnly.length <= 15) {
                          setDriverForm({...driverForm, phone: value});
                          if (driverErrors.phone) setDriverErrors({...driverErrors, phone: ""});
                        }
                      }}
                      placeholder="+94 123 456 789"
                      maxLength="20"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        driverErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {driverErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">⚠️ {driverErrors.phone}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={driverForm.email}
                      onChange={(e) => {
                        setDriverForm({...driverForm, email: e.target.value});
                        if (driverErrors.email) setDriverErrors({...driverErrors, email: ""});
                      }}
                      placeholder="driver@example.com"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        driverErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {driverErrors.email && (
                      <p className="text-red-500 text-sm mt-1">⚠️ {driverErrors.email}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">📧 Email for notifications (optional)</p>
                  </div>

                  {/* Vehicle Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Vehicle
                    </label>
                    <select
                      value={driverForm.vehicleId}
                      onChange={(e) => {
                        setDriverForm({...driverForm, vehicleId: e.target.value});
                        if (driverErrors.vehicleId) setDriverErrors({...driverErrors, vehicleId: ""});
                      }}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        driverErrors.vehicleId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Vehicle (Optional)</option>
                      {vehicles.filter(v => v.status === 'available' || v._id === driverForm.vehicleId || v.id === driverForm.vehicleId).map(v => (
                        <option key={v._id || v.id} value={v._id || v.id}>
                          {v.type} - {v.number} ({v.capacity || 'N/A'})
                        </option>
                      ))}
                    </select>
                    {driverErrors.vehicleId && (
                      <p className="text-red-500 text-sm mt-1">⚠️ {driverErrors.vehicleId}</p>
                    )}
                  </div>

                  {/* Route Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Route
                    </label>
                    <select
                      value={driverForm.routeId}
                      onChange={(e) => {
                        setDriverForm({...driverForm, routeId: e.target.value});
                        if (driverErrors.routeId) setDriverErrors({...driverErrors, routeId: ""});
                      }}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        driverErrors.routeId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Route (Optional)</option>
                      {routes.map(r => (
                        <option key={r._id || r.id} value={r._id || r.id}>
                          {r.name} - {r.area} ({r.distance || 'N/A'})
                        </option>
                      ))}
                    </select>
                    {driverErrors.routeId && (
                      <p className="text-red-500 text-sm mt-1">⚠️ {driverErrors.routeId}</p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition-all shadow-lg"
                  >
                    {editDriverId ? "💾 Update Driver" : "➕ Add Driver"}
                  </button>
                  
                  {editDriverId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditDriverId(null);
                        setDriverForm({ name: "", license: "", phone: "", email: "", vehicleId: "", routeId: "" });
                        setDriverErrors({});
                      }}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg font-semibold transition-all"
                    >
                      ❌ Cancel Edit
                    </button>
                  )}
                </form>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowVehicleForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all"
                  >
                    🚗 Add Vehicle
                  </button>
                  <button
                    onClick={() => setShowRouteForm(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold transition-all"
                  >
                    🗺️ Add Route
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Column - Drivers List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Drivers ({filteredDrivers.length})</h2>
                <input
                  type="text"
                  placeholder="🔍 Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredDrivers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">👨‍💼</div>
                    <p>No drivers found</p>
                    <p className="text-sm mt-2">Add your first driver to get started</p>
                  </div>
                ) : (
                  filteredDrivers.map(driver => (
                    <div key={driver._id || driver.id} className="border rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{driver.name}</h3>
                          <p className="text-sm text-gray-600">📋 License: {driver.license}</p>
                          <p className="text-sm text-gray-600">📞 Phone: {driver.phone}</p>
                          <p className="text-sm text-gray-600">🚗 Vehicle: {getVehicleName(driver.vehicleId)}</p>
                          <p className="text-sm text-gray-600">🗺️ Route: {getRouteName(driver.routeId)}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleEditDriver(driver._id || driver.id)}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-all"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver._id || driver.id)}
                            className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-all"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column - Vehicles & Routes */}
            <div className="space-y-6">
              {/* Vehicles */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Vehicles ({vehicles.length})</h2>
                <div className="space-y-3 max-h-[280px] overflow-y-auto">
                  {vehicles.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-2xl mb-2">🚗</p>
                      <p className="text-sm">No vehicles yet</p>
                    </div>
                  ) : (
                    vehicles.map(vehicle => (
                      <div key={vehicle._id || vehicle.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <strong>{vehicle.type} - {vehicle.number}</strong>
                            <p className="text-sm text-gray-600">
                              {vehicle.capacity || 'N/A'} • 
                              <span className={`ml-1 ${
                                vehicle.status === 'available' ? 'text-green-600' : 
                                vehicle.status === 'in-use' ? 'text-blue-600' : 'text-red-600'
                              }`}>
                                {vehicle.status}
                              </span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditVehicle(vehicle._id || vehicle.id)}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteVehicle(vehicle._id || vehicle.id)}
                              className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Routes */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Routes ({routes.length})</h2>
                <div className="space-y-3 max-h-[280px] overflow-y-auto">
                  {routes.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-2xl mb-2">🗺️</p>
                      <p className="text-sm">No routes yet</p>
                    </div>
                  ) : (
                    routes.map(route => (
                      <div key={route._id || route.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong>{route.name}</strong>
                            <p className="text-sm text-gray-600">{route.area}</p>
                            <p className="text-sm text-gray-600">
                              {route.stops && `${route.stops} stops • `}
                              {route.distance && `${route.distance} • `}
                              {route.estimatedTime}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditRoute(route._id || route.id)}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteRoute(route._id || route.id)}
                              className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Form Modal */}
        {showVehicleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {editVehicleId ? "✏️ Edit Vehicle" : "➕ Add Vehicle"}
              </h2>
              <form onSubmit={handleVehicleSubmit} className="space-y-4">
                {/* Type Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={vehicleForm.type}
                    onChange={(e) => {
                      setVehicleForm({...vehicleForm, type: e.target.value});
                      if (vehicleErrors.type) setVehicleErrors({...vehicleErrors, type: ""});
                    }}
                    className={`w-full p-3 border rounded-lg ${
                      vehicleErrors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Type</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Bicycle">Bicycle</option>
                  </select>
                  {vehicleErrors.type && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {vehicleErrors.type}</p>
                  )}
                </div>

                {/* Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicleForm.number}
                    onChange={(e) => {
                      setVehicleForm({...vehicleForm, number: e.target.value.toUpperCase()});
                      if (vehicleErrors.number) setVehicleErrors({...vehicleErrors, number: ""});
                    }}
                    placeholder="AB-1234"
                    className={`w-full p-3 border rounded-lg ${
                      vehicleErrors.number ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {vehicleErrors.number && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {vehicleErrors.number}</p>
                  )}
                </div>

                {/* Capacity Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="text"
                    value={vehicleForm.capacity}
                    onChange={(e) => {
                      setVehicleForm({...vehicleForm, capacity: e.target.value});
                      if (vehicleErrors.capacity) setVehicleErrors({...vehicleErrors, capacity: ""});
                    }}
                    placeholder="500kg or 2 tons"
                    className={`w-full p-3 border rounded-lg ${
                      vehicleErrors.capacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {vehicleErrors.capacity && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {vehicleErrors.capacity}</p>
                  )}
                </div>

                {/* Status Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={vehicleForm.status}
                    onChange={(e) => {
                      setVehicleForm({...vehicleForm, status: e.target.value});
                      if (vehicleErrors.status) setVehicleErrors({...vehicleErrors, status: ""});
                    }}
                    className={`w-full p-3 border rounded-lg ${
                      vehicleErrors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="in-use">In Use</option>
                  </select>
                  {vehicleErrors.status && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {vehicleErrors.status}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
                  >
                    {editVehicleId ? "💾 Update" : "➕ Add"} Vehicle
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowVehicleForm(false);
                      setEditVehicleId(null);
                      setVehicleForm({ type: "", number: "", capacity: "", status: "available" });
                      setVehicleErrors({});
                    }}
                    className="px-4 py-3 border rounded-lg hover:bg-gray-100"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Route Form Modal - Rendered outside main container */}
    {showRouteForm && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
        style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        onClick={(e) => {
          // Close modal if clicking on backdrop
          if (e.target === e.currentTarget) {
            setShowRouteForm(false);
            setEditRouteId(null);
            setRouteForm({ name: "", area: "", stops: "", distance: "", estimatedTime: "" });
            setRouteErrors({});
          }
        }}
      >
        <div 
          className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" 
          style={{ position: 'relative', zIndex: 10000, pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editRouteId ? "✏️ Edit Route" : "➕ Add Route"}
            </h2>
            <button
              type="button"
              onClick={(e) => {
                console.log("❌ Close button clicked!");
                e.stopPropagation();
                setShowRouteForm(false);
                setEditRouteId(null);
                setRouteForm({ name: "", area: "", stops: "", distance: "", estimatedTime: "" });
                setRouteErrors({});
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Route Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={routeForm.name}
                onChange={(e) => {
                  setRouteForm({...routeForm, name: e.target.value});
                  if (routeErrors.name) setRouteErrors({...routeErrors, name: ""});
                }}
                placeholder="City Center Route"
                className={`w-full p-3 border rounded-lg ${
                  routeErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {routeErrors.name && (
                <p className="text-red-500 text-sm mt-1">⚠️ {routeErrors.name}</p>
              )}
            </div>

            {/* Area Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={routeForm.area}
                onChange={(e) => {
                  setRouteForm({...routeForm, area: e.target.value});
                  if (routeErrors.area) setRouteErrors({...routeErrors, area: ""});
                }}
                placeholder="Colombo 07"
                className={`w-full p-3 border rounded-lg ${
                  routeErrors.area ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {routeErrors.area && (
                <p className="text-red-500 text-sm mt-1">⚠️ {routeErrors.area}</p>
              )}
            </div>

            {/* Stops Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Stops
              </label>
              <input
                type="number"
                value={routeForm.stops}
                onChange={(e) => {
                  setRouteForm({...routeForm, stops: e.target.value});
                  if (routeErrors.stops) setRouteErrors({...routeErrors, stops: ""});
                }}
                placeholder="10"
                min="1"
                max="100"
                className={`w-full p-3 border rounded-lg ${
                  routeErrors.stops ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {routeErrors.stops && (
                <p className="text-red-500 text-sm mt-1">⚠️ {routeErrors.stops}</p>
              )}
            </div>

            {/* Distance Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance
              </label>
              <input
                type="text"
                value={routeForm.distance}
                onChange={(e) => {
                  setRouteForm({...routeForm, distance: e.target.value});
                  if (routeErrors.distance) setRouteErrors({...routeErrors, distance: ""});
                }}
                placeholder="15km or 10 miles"
                className={`w-full p-3 border rounded-lg ${
                  routeErrors.distance ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {routeErrors.distance && (
                <p className="text-red-500 text-sm mt-1">⚠️ {routeErrors.distance}</p>
              )}
            </div>

            {/* Estimated Time Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time
              </label>
              <input
                type="text"
                value={routeForm.estimatedTime}
                onChange={(e) => {
                  setRouteForm({...routeForm, estimatedTime: e.target.value});
                  if (routeErrors.estimatedTime) setRouteErrors({...routeErrors, estimatedTime: ""});
                }}
                placeholder="2 hours or 30 mins"
                className={`w-full p-3 border rounded-lg ${
                  routeErrors.estimatedTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {routeErrors.estimatedTime && (
                <p className="text-red-500 text-sm mt-1">⚠️ {routeErrors.estimatedTime}</p>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t mt-6">
              <button 
                type="button"
                onMouseDown={(e) => {
                  console.log("🖱️ MOUSEDOWN on Update Route button!");
                }}
                onClick={(e) => {
                  console.log("🖱️ CLICK on Update Route button!");
                  e.preventDefault();
                  e.stopPropagation();
                  handleRouteSubmit(e);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white p-4 rounded-lg font-bold text-lg cursor-pointer transition-all"
                style={{ 
                  pointerEvents: 'auto', 
                  position: 'relative', 
                  zIndex: 10001,
                  touchAction: 'manipulation',
                  userSelect: 'none'
                }}
              >
                {editRouteId ? "💾 Update Route" : "➕ Add Route"}
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  console.log("❌ Cancel button clicked!");
                  e.stopPropagation();
                  setShowRouteForm(false);
                  setEditRouteId(null);
                  setRouteForm({ name: "", area: "", stops: "", distance: "", estimatedTime: "" });
                  setRouteErrors({});
                }}
                className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer font-semibold"
                style={{ pointerEvents: 'auto' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}