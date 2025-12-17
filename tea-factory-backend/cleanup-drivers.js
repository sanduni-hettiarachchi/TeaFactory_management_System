const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function cleanupDrivers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all drivers
    const result = await mongoose.connection.db.collection('drivers').deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} old driver records`);

    console.log('✅ Cleanup complete! You can now add drivers with the new schema.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupDrivers();