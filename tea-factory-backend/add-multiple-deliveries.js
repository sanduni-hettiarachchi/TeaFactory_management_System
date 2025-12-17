const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function addMultipleDeliveries() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all drivers
    const drivers = await mongoose.connection.db.collection('drivers').find().toArray();
    if (drivers.length === 0) {
      console.log('❌ No drivers found. Please add drivers first.');
      process.exit(1);
    }

    console.log(`📋 Found ${drivers.length} driver(s)`);

    const customers = [
      { name: 'Alice Johnson', address: '123 Main St, Colombo 07', phone: '+94 771111111', package: 'Electronics' },
      { name: 'Bob Williams', address: '456 Park Ave, Colombo 03', phone: '+94 772222222', package: 'Books' },
      { name: 'Carol Davis', address: '789 Lake Rd, Colombo 05', phone: '+94 773333333', package: 'Clothing' },
      { name: 'David Brown', address: '321 Hill St, Colombo 08', phone: '+94 774444444', package: 'Food' },
      { name: 'Emma Wilson', address: '654 Beach Rd, Colombo 06', phone: '+94 775555555', package: 'Furniture' }
    ];

    const deliveries = [];
    
    for (let i = 0; i < Math.min(drivers.length, customers.length); i++) {
      const driver = drivers[i];
      const customer = customers[i];

      const delivery = {
        customerName: customer.name,
        customerAddress: customer.address,
        customerPhone: customer.phone,
        packageDetails: customer.package,
        status: 'Out for Delivery',
        driverId: driver._id.toString(),
        driverName: driver.name,
        // Random locations around Colombo
        driverLocation: {
          lat: 6.9271 + (Math.random() - 0.5) * 0.1,
          lng: 79.8612 + (Math.random() - 0.5) * 0.1
        },
        customerLocation: {
          lat: 6.9271 + (Math.random() - 0.5) * 0.15,
          lng: 79.8612 + (Math.random() - 0.5) * 0.15
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      deliveries.push(delivery);
      console.log(`✅ Created delivery for ${driver.name} → ${customer.name}`);
    }

    await mongoose.connection.db.collection('deliveries').insertMany(deliveries);
    
    console.log(`\n🎉 Successfully created ${deliveries.length} deliveries!`);
    console.log('🗺️  Go to Drivers page → Show Live GPS Map to see all active drivers!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addMultipleDeliveries();