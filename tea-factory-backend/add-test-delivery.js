const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function addTestDelivery() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get a driver
    const drivers = await mongoose.connection.db.collection('drivers').find().toArray();
    if (drivers.length === 0) {
      console.log('❌ No drivers found. Please add a driver first.');
      process.exit(1);
    }

    const driver = drivers[0];
    console.log(`📋 Using driver: ${driver.name} (${driver.license})`);

    // Create test delivery
    const testDelivery = {
      customerName: 'Test Customer',
      customerAddress: '123 Main Street, Colombo 07',
      customerPhone: '+94 771234567',
      packageDetails: 'Test Package - Electronics',
      status: 'Out for Delivery',
      driverId: driver._id.toString(),
      driverName: driver.name,
      // Random location near Colombo
      driverLocation: {
        lat: 6.9271 + (Math.random() - 0.5) * 0.05,
        lng: 79.8612 + (Math.random() - 0.5) * 0.05
      },
      customerLocation: {
        lat: 6.9271 + (Math.random() - 0.5) * 0.1,
        lng: 79.8612 + (Math.random() - 0.5) * 0.1
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await mongoose.connection.db.collection('deliveries').insertOne(testDelivery);
    console.log('✅ Test delivery created!');
    console.log('📦 Delivery ID:', result.insertedId);
    console.log('👤 Driver:', driver.name);
    console.log('📍 Status: Out for Delivery');
    console.log('\n🗺️  Now go to Drivers page → Show Live GPS Map to see the driver!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTestDelivery();