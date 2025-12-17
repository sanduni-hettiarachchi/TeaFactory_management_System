const express = require("express");
const { addCustomer, getAllCustomers, updateCustomer, deleteCustomer, confirmCustomer } = require("../controllers/customerController");

const router = express.Router();


// Routes
router.post("/", addCustomer)
router.get("/getCustomer", getAllCustomers)
router.put("/:id", updateCustomer)
router.delete("/:id", deleteCustomer)
router.patch("/:id/confirm", confirmCustomer)


module.exports = router