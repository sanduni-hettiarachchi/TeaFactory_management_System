const Customer = require("../model/AddCustomer");

const addCustomer = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      address,
      country,
      businessType,
      teaProducts,
      monthlyRequirement,
      additionalNotes
    } = req.body;

    // ✅ Validations
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    if (!/^(0\d{9}|\+\d{1,3}\d{6,14})$/.test(phone)) {
      return res.status(400).json({ success: false, error: "Invalid phone number" });
    }

    const newCustomer = new Customer({
      companyName,
      contactPerson,
      email,
      phone,
      address,
      country,
      businessType,
      teaProducts,
      monthlyRequirement,
      additionalNotes
    });

    await newCustomer.save();
    return res.status(201).json({ success: true, customer: newCustomer });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

// ✅ Update customer
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error updating customer" });
  }
};

// ✅ Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    res.json({ success: true, message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error deleting customer" });
  }
};

// ✅ Confirm registration (status update)
const confirmCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { status: "Registered" },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error confirming customer" });
  }
};

exports.updateCustomer = updateCustomer
exports.deleteCustomer = deleteCustomer
exports.confirmCustomer = confirmCustomer
exports.getAllCustomers = getAllCustomers
exports.addCustomer = addCustomer;
