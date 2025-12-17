const mongoose = require('mongoose');
const StockTransaction = require('./model/StockTransaction');
require('dotenv').config();

async function testTransactions() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/teafactory');
    console.log('Connected to MongoDB');

    const transactionCount = await StockTransaction.countDocuments();
    console.log(`Total transactions in database: ${transactionCount}`);

    const recentTransactions = await StockTransaction.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log('Recent transactions:');
    recentTransactions.forEach(t => {
      console.log(`- ${t.itemId}: ${t.transactionType} ${t.quantity} (${t.createdAt})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testTransactions();