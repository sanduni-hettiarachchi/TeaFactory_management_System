const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.db.collection('drivers');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(index => {
      console.log('  -', JSON.stringify(index.key), index.name);
    });

    // Drop the email index if it exists
    try {
      await collection.dropIndex('email_1');
      console.log('\n✅ Dropped old email index');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n⚠️  Email index does not exist (already removed)');
      } else {
        console.log('\n❌ Error dropping index:', error.message);
      }
    }

    // Show indexes after cleanup
    const newIndexes = await collection.indexes();
    console.log('\n📋 Indexes after cleanup:');
    newIndexes.forEach(index => {
      console.log('  -', JSON.stringify(index.key), index.name);
    });

    console.log('\n✅ Index cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixIndexes();