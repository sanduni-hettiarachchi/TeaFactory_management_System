const express = require('express');
const { addSupplier, getSuppliers, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const router = express.Router();

router.post("/add", addSupplier);
router.get("/all", getSuppliers);
router.put("/update/:id", updateSupplier);
router.delete("/delete/:id", deleteSupplier);




module.exports = router;