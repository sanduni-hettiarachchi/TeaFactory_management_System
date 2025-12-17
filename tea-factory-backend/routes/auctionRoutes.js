const express = require("express");
const router = express.Router();
const Auction = require("../model/auctionModel");
const Order = require("../model/OrderModel");
const mongoose = require("mongoose");

// Create Auction for an order (admin)
router.post("/", async (req, res) => {
  try {
    const { auctionId, orderId, startDate, endDate, minBid } = req.body;

    if (!auctionId || !startDate || !endDate || !minBid) {
      return res.status(400).json({ success: false, error: "All fields are required (auctionId, startDate, endDate, minBid). orderId is optional." });
    }

    let linkedOrderId = undefined;
    if (orderId) {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, error: "Invalid Order ID" });
      }
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }
      linkedOrderId = orderId;
    }

    const auction = await Auction.create({
      auctionId: String(auctionId).trim(),
      orderId: linkedOrderId,
      startDate,
      endDate,
      minBid,
      highestBid: minBid,
      highestBidder: null,
      bids: [],
      status: "Open",
    });

    res.status(201).json({ success: true, auction });
  } catch (err) {
    console.error(err.message);
    // Handle duplicate auctionId error gracefully
    if (err && err.code === 11000) {
      return res.status(409).json({ success: false, error: "auctionId already exists. Please use a unique ID." });
    }
    res.status(500).json({ success: false, error: "Server error while creating auction" });
  }
});

// Get all auctions
router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find().populate("orderId");
    res.status(200).json({ success: true, auctions });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error while fetching auctions" });
  }
});

// Place a bid
router.post("/:id/bid", async (req, res) => {
  try {
    const { id } = req.params;
    const { bidderName, amount } = req.body;

    if (!bidderName || amount === undefined) {
      return res.status(400).json({ success: false, error: "Bidder name and amount are required" });
    }

    const bidAmount = Number(amount);
    if (isNaN(bidAmount)) {
      return res.status(400).json({ success: false, error: "Bid amount must be a number" });
    }

    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ success: false, error: "Auction not found" });

    if (auction.status === "Closed") {
      return res.status(400).json({ success: false, error: "Auction is closed" });
    }

    if (bidAmount <= auction.highestBid) {
      return res.status(400).json({ success: false, error: "Bid must be higher than current highest" });
    }

    auction.bids.push({ bidderName, amount: bidAmount });
    auction.highestBid = bidAmount;
    auction.highestBidder = bidderName;
    await auction.save();

    res.status(200).json({ success: true, auction });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error while placing bid" });
  }
});

// Close auction
router.put("/:id/close", async (req, res) => {
  try {
    const { id } = req.params;

    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ success: false, error: "Auction not found" });

    if (auction.status === "Closed") {
      return res.status(400).json({ success: false, error: "Auction already closed" });
    }

    auction.status = "Closed";

    // Connect with order: mark confirmed and store winner info
    // Use findByIdAndUpdate with validation disabled to avoid failing on legacy docs
    await Order.findByIdAndUpdate(
      auction.orderId,
      {
        $set: {
          status: "Confirmed",
          auctionWinner: auction.highestBidder || null,
        },
      },
      { new: true, runValidators: false }
    );

    await auction.save();
    res.status(200).json({ success: true, auction });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error while closing auction" });
  }
});

module.exports = router;
