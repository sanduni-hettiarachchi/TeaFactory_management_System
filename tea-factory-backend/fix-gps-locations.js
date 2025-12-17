const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Real locations in Colombo, Sri Lanka
const realLocations = {
  // Driver starting points (different areas of Colombo)
  driverLocations: [
    { name: 'Colombo Fort', lat: 6.9344, lng: 79.8428 },
    { name: 'Pettah', lat: 6.9388, lng: 79.8553 },
    { name: 'Bambalapitiya', lat: 6.8887, lng: 79.8566 },
    { name: 'Dehiwala', lat: 6.8562, lng: 79.8632 }
  ],
  // Customer destinations (different areas)
  customerLocations: [
    { name: 'Mount Lavinia', lat: 6.8373, lng: 79.8636 },
    { name: 'Nugegoda', lat: 6.8649, lng: 79.8997 },
    { name: 'Maharagama', lat: 6.8481, lng: 79.9267 },
    { name: 'Rajagiriya', lat: 6.9086, lng: 79.8916 },
    { name: 'Kotte', lat: 6.8905, lng: 79.9018 }
  ]
};

async function fixGPSLocations() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all active deliveries
    const deliveries = await mongoose.connection.db.collection('deliveries')
      .find({ status: 'Out for Delivery' })
      .toArray();

    console.log(`📦 Found ${deliveries.length} active deliveries`);

    if (deliveries.length === 0) {
      console.log('⚠️  No active deliveries found');
      process.exit(0);
    }

    let updated = 0;
    for (let i = 0; i < deliveries.length; i++) {
      const delivery = deliveries[i];
      
      // Assign fixed locations (cycle through available locations)
      const driverLoc = realLocations.driverLocations[i % realLocations.driverLocations.length];
      const customerLoc = realLocations.customerLocations[i % realLocations.customerLocations.length];

      // Update delivery with fixed locations
      await mongoose.connection.db.collection('deliveries').updateOne(
        { _id: delivery._id },
        {
          $set: {
            driverLocation: {
              lat: driverLoc.lat,
              lng: driverLoc.lng
            },
            customerLocation: {
              lat: customerLoc.lat,
              lng: customerLoc.lng
            },
            driverLocationName: driverLoc.name,
            customerLocationName: customerLoc.name,
            updatedAt: new Date()
          }
        }
      );

      console.log(`✅ Updated delivery for ${delivery.driverName || 'Unknown'}`);
      console.log(`   Driver at: ${driverLoc.name} (${driverLoc.lat}, ${driverLoc.lng})`);
      console.log(`   Customer at: ${customerLoc.name} (${customerLoc.lat}, ${customerLoc.lng})`);
      
      updated++;
    }

    console.log(`\n🎉 Successfully updated ${updated} deliveries with fixed GPS locations!`);
    console.log('🗺️  Now the routes and distances will be consistent!');
    console.log('📍 Locations will not change when you zoom the map');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixGPSLocations();