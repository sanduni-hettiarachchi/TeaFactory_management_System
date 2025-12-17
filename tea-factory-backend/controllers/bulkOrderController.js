const BulkOrder = require("../model/BulkOrder");

// Create bulk order (with optional document metadata)
exports.createBulkOrder = async (req, res) => {
  try {
    const {
      companyName,
      email,
      contactNumber,
      teaType,
      packaging,
      quantityKg,
      deliveryDate,
      notes,
    } = req.body;

    if (!companyName || !contactNumber || !teaType || !packaging) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const docs = (req.files || []).map((f) => ({
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
    }));

    const bulkOrder = await BulkOrder.create({
      companyName,
      email,
      contactNumber,
      teaType,
      packaging,
      quantityKg: Number(quantityKg),
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      notes,
      documents: docs,
    });

    return res.json({ success: true, bulkOrder });
  } catch (err) {
    console.error("createBulkOrder error:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

// (Optional) list for admin
exports.listBulkOrders = async (_req, res) => {
  try {
    const items = await BulkOrder.find().sort({ createdAt: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    console.error("listBulkOrders error:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

// Update status (Confirm/Approve or Reject)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expect "Approved" | "Rejected" | "Submitted"
    if (!status) return res.status(400).json({ success: false, error: "Missing status" });
    const allowed = ["Submitted", "Approved", "Rejected"];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, error: "Invalid status" });
    const updated = await BulkOrder.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, item: updated });
  } catch (err) {
    console.error("updateStatus error:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

// Delete bulk order
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BulkOrder.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    console.error("remove error:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};
