// deliveryRoutes.js (CommonJS)
const express = require("express");
const {
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
} = require("../controllers/deliveryController");

const router = express.Router();

router.post("/", createDelivery);
router.get("/", getDeliveries);
router.get("/:id", getDeliveryById);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);

module.exports = router; // <-- CommonJS export
