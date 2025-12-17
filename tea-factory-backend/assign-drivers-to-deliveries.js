const mongoose = require('mongoose');
const Driver = require('./model/Driver');
const Delivery = require('./model/Delivery');

const MONGODB_URI = 'mongodb://localhost:27017/delivery_management';

// Sample locations in Colombo area
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
  { name: "Bambalapitiya", lat: 6.8905, lng: 79.8563 },
  { name: "Kollupitiya", lat: 6.9147, lng: 79.8501 },
  { name: "Slave Island", lat: 6.9271, lng: 79.8558 }
];

// Generate random location near a base location
const randomNearby = (baseLat, baseLng, radiusKm = 2) => {
  const radiusInDegrees = radiusKm / 111;
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

async function assignDriversToDeliveries() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all drivers
    const drivers = await Driver.find();
    console.log(`📋 Found ${drivers.length} drivers`);

    if (drivers.length === 0) {
      console.log('❌ No drivers found! Please add drivers first.');
      return;
    }

    // Get all deliveries with "Out for Delivery" status
    const deliveries = await Delivery.find({ 
      status: { $in: ['Out for Delivery', 'Pending'] }
    });
    console.log(`📦 Found ${deliveries.length} active deliveries`);

    if (deliveries.length === 0) {
      console.log('❌ No active deliveries found!');
      return;
    }

    let updatedCount = 0;
    let driverIndex = 0;

    // Assign each delivery to a driver (round-robin)
    for (let i = 0; i < deliveries.length; i++) {
      const delivery = deliveries[i];
      const driver = drivers[driverIndex % drivers.length];

      // Generate locations
      const customerLoc = locations[i % locations.length];
      const driverLoc = randomNearby(customerLoc.lat, customerLoc.lng, 3);

      // Update delivery with driver and locations
      await Delivery.findByIdAndUpdate(delivery._id, {
        driverId: driver._id,
        customerLocation: {
          lat: customerLoc.lat,
          lng: customerLoc.lng
        },
        driverLocation: {
          lat: driverLoc.lat,
          lng: driverLoc.lng
        },
        customerAddress: delivery.customerAddress || `${customerLoc.name}, Colombo, Sri Lanka`
      });

      console.log(`✅ Assigned ${driver.name} to delivery for ${delivery.customerName} at ${customerLoc.name}`);
      updatedCount++;
      driverIndex++; // Move to next driver for better distribution
    }

    console.log('\n🎉 SUCCESS!');
    console.log(`✅ Updated ${updatedCount} deliveries`);
    console.log(`✅ Distributed across ${drivers.length} drivers`);
    console.log(`✅ Each driver has ~${Math.ceil(updatedCount / drivers.length)} deliveries`);
    console.log('\n📍 Now check the GPS map - you should see all drivers!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

assignDriversToDeliveries();