const Supplier = require("../model/Suplier");

//Add Supplier
const addSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//Get All Suppliers
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update Supplier
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete Supplier
const deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Supplier deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addSupplier = addSupplier
exports.getSuppliers = getSuppliers
exports.updateSupplier = updateSupplier
exports.deleteSupplier = deleteSupplier
