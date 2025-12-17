const mongoose = require('mongoose');

const Driver = require('./model/Driver');
const Delivery = require('./model/Delivery');
const Vehicle = require('./model/Vehicle');
const Route = require('./model/Route');

const MONGODB_URI = 'mongodb://localhost:27017/delivery_management';

// Sample locations in Sri Lanka (Colombo area)
const locations = [
  { name: "Colombo Fort", lat: 6.9344, lng: 79.8428 },
  { name: "Dehiwala", lat: 6.8520, lng: 79.8630 },
  { name: "Mount Lavinia", lat: 6.8389, lng: 79.8630 },
  { name: "Nugegoda", lat: 6.8649, lng: 79.8997 },
  { name: "Maharagama", lat: 6.8484, lng: 79.9267 },
  { name: "Kotte", lat: 6.8905, lng: 79.9015 },
  { name: "Battaramulla", lat: 6.8986, lng: 79.9186 },
  { name: "Rajagiriya", lat: 6.9089, lng: 79.8915 },
  { name: "Wellawatte", lat: 6.8774, lng: 79.8574 },
  { name: "Bambalapitiya", lat: 6.8905, lng: 79.8563 }
];

// Generate random location near a base location
const randomNearby = (baseLat, baseLng, radiusKm = 2) => {
  const radiusInDegrees = radiusKm / 111; // 1 degree ≈ 111 km
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  return {
    lat: parseFloat((baseLat + x).toFixed(6)),
    lng: parseFloat((baseLng + y).toFixed(6))
  };
};

async function addTestDriversWithDeliveries() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create vehicles first
    const vehicles = [
      { type: 'Van', number: 'CAB-1234', capacity: '500kg', status: 'in-use' },
      { type: 'Truck', number: 'CAB-5678', capacity: '1 ton', status: 'in-use' },
      { type: 'Bike', number: 'CAB-9012', capacity: '50kg', status: 'in-use' },
      { type: 'Van', number: 'CAB-3456', capacity: '500kg', status: 'in-use' },
      { type: 'Truck', number: 'CAB-7890', capacity: '1 ton', status: 'in-use' },
      { type: 'Van', number: 'CAB-2468', capacity: '500kg', status: 'in-use' },
      { type: 'Bike', number: 'CAB-1357', capacity: '50kg', status: 'in-use' },
      { type: 'Van', number: 'CAB-9753', capacity: '500kg', status: 'in-use' }
    ];

    const savedVehicles = [];
    for (const vehicle of vehicles) {
      const existing = await Vehicle.findOne({ number: vehicle.number });
      if (!existing) {
        const saved = await Vehicle.create(vehicle);
        savedVehicles.push(saved);
        console.log(`✅ Created vehicle: ${vehicle.number}`);
      } else {
        savedVehicles.push(existing);
        console.log(`⏭️  Vehicle exists: ${vehicle.number}`);
      }
    }

    // Create routes
    const routes = [
      { name: 'Route A', area: 'Colombo Central', stops: '5', distance: '15km', estimatedTime: '45 mins' },
      { name: 'Route B', area: 'Colombo South', stops: '6', distance: '20km', estimatedTime: '60 mins' },
      { name: 'Route C', area: 'Colombo North', stops: '4', distance: '12km', estimatedTime: '40 mins' },
      { name: 'Route D', area: 'Colombo East', stops: '7', distance: '25km', estimatedTime: '75 mins' },
      { name: 'Route E', area: 'Colombo West', stops: '5', distance: '18km', estimatedTime: '50 mins' }
    ];

    const savedRoutes = [];
    for (const route of routes) {
      const existing = await Route.findOne({ name: route.name });
      if (!existing) {
        const saved = await Route.create(route);
        savedRoutes.push(saved);
        console.log(`✅ Created route: ${route.name}`);
      } else {
        savedRoutes.push(existing);
        console.log(`⏭️  Route exists: ${route.name}`);
      }
    }

    // Create drivers with deliveries
    const drivers = [
      { name: 'Kamal Silva', license: 'DL-12345', phone: '+94771234567' },
      { name: 'Nimal Perera', license: 'DL-23456', phone: '+94772345678' },
      { name: 'Sunil Fernando', license: 'DL-34567', phone: '+94773456789' },
      { name: 'Anil Jayawardena', license: 'DL-45678', phone: '+94774567890' },
      { name: 'Ravi Dissanayake', license: 'DL-56789', phone: '+94775678901' },
      { name: 'Chaminda Bandara', license: 'DL-67890', phone: '+94776789012' },
      { name: 'Pradeep Kumara', license: 'DL-78901', phone: '+94777890123' },
      { name: 'Mahesh Wickramasinghe', license: 'DL-89012', phone: '+94778901234' }
    ];

    const customers = [
      'Saman Gunawardena', 'Dilini Rajapaksa', 'Tharaka Wijesinghe', 
      'Nadeesha Fernando', 'Kasun Perera', 'Sanduni Silva',
      'Roshan Jayasuriya', 'Chamari Mendis', 'Lasith Malinga',
      'Thisara Perera'
    ];

    const products = [
      'Electronics Package', 'Grocery Items', 'Furniture Set',
      'Medical Supplies', 'Books & Stationery', 'Clothing Items',
      'Food Delivery', 'Hardware Tools', 'Sports Equipment', 'Home Appliances'
    ];

    let deliveryCount = 0;

    for (let i = 0; i < drivers.length; i++) {
      const driverData = drivers[i];
      
      // Check if driver exists
      const existingDriver = await Driver.findOne({ license: driverData.license });
      if (existingDriver) {
        console.log(`⏭️  Driver exists: ${driverData.name}`);
        continue;
      }

      // Create driver
      const driver = await Driver.create({
        ...driverData,
        vehicleId: savedVehicles[i % savedVehicles.length]._id,
        routeId: savedRoutes[i % savedRoutes.length]._id,
        status: 'active'
      });

      console.log(`✅ Created driver: ${driver.name}`);

      // Create 1-2 active deliveries for this driver
      const numDeliveries = Math.random() > 0.5 ? 2 : 1;
      
      for (let j = 0; j < numDeliveries; j++) {
        const customerLocation = locations[Math.floor(Math.random() * locations.length)];
        const driverLocation = randomNearby(customerLocation.lat, customerLocation.lng, 3);

        const delivery = await Delivery.create({
          customerName: customers[Math.floor(Math.random() * customers.length)],
          contactNumber: `+9477${Math.floor(1000000 + Math.random() * 9000000)}`,
          orderQuantity: Math.floor(Math.random() * 10) + 1,
          product: products[Math.floor(Math.random() * products.length)],
          status: 'Out for Delivery',
          customerAddress: `${customerLocation.name}, Colombo, Sri Lanka`,
          customerLocation: {
            lat: customerLocation.lat,
            lng: customerLocation.lng
          },
          driverLocation: {
            lat: driverLocation.lat,
            lng: driverLocation.lng
          },
          driverId: driver._id
        });

        deliveryCount++;
        console.log(`  📦 Created delivery for ${delivery.customerName} at ${customerLocation.name}`);
      }
    }

    console.log('\n🎉 SUCCESS!');
    console.log(`✅ Created ${drivers.length} drivers`);
    console.log(`✅ Created ${deliveryCount} active deliveries`);
    console.log(`✅ All drivers are now visible on GPS map!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

addTestDriversWithDeliveries();