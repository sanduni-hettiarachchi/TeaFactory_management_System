const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  bidderName: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const auctionSchema = new mongoose.Schema({
  auctionId: { type: String, required: true, unique: true, trim: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  minBid: { type: Number, required: true },
  highestBid: { type: Number, default: 0 },
  highestBidder: { type: String, default: null },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  bids: [bidSchema]
}, { timestamps: true });

const Auction = mongoose.model("Auction", auctionSchema);
module.exports = Auction