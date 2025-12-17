// src/pages/customer/BulkOrders.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

const TEA_TYPES = [
  "Organic Tea",
  "Premium Black Tea",
  "Herbal Mix Tea",
  "Loose Leaf Tea",
  "Flavoured Tea",
  "Ceylon Black Tea",
  "Green Tea",
  "Mint Green Tea",
  "Chamomile Tea",
  "Cinnamon Black Tea",
];

const PRICE_PER_KG = {
  "Organic Tea": 10000,
  "Premium Black Tea": 5000,
  "Herbal Mix Tea": 4000,
  "Loose Leaf Tea": 3000,
  "Flavoured Tea": 2000,
  "Ceylon Black Tea": 1800,
  "Green Tea": 1500,
  "Mint Green Tea": 1200,
  "Chamomile Tea": 1000,
  "Cinnamon Black Tea": 1000,
};

const PACKAGING = [
  "Loose Leaf",
  "Tea Bags",
  "1 kg Pack",
  "5 kg Bag",
  "25 kg Sack",
];

export default function BulkOrders() {
  const API_URL = "http://localhost:3001";
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    contactNumber: "",
    teaType: "",
    packaging: "",
    quantityKg: 50,
    deliveryDate: "",
    notes: "",
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const unitPrice = PRICE_PER_KG[form.teaType] || 0;
  const estimatedTotal = (Number(form.quantityKg) || 0) * unitPrice;
  const fmt = (n) => `LKR ${Number(n || 0).toLocaleString()}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: name === "quantityKg" ? Number(value) : value }));
  };

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.contactNumber.trim() || !form.teaType || !form.packaging) {
      toast.error("Please fill required fields");
      return;
    }
    if (Number(form.quantityKg) < 50) {
      toast.error("Minimum bulk order is 50 kg");
      return;
    }

    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v ?? "")));
      files.forEach((f, i) => fd.append("documents", f, f.name));

      const res = await fetch(`${API_URL}/api/bulk-orders`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || `HTTP ${res.status}`);

      toast.success("Bulk order submitted. You'll receive a confirmation email.");
      setForm({ companyName: "", email: "", contactNumber: "", teaType: "", packaging: "", quantityKg: 50, deliveryDate: "", notes: "" });
      setFiles([]);
    } catch (err) {
      toast.error(err.message || "Failed to submit bulk order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Banner */}
      <div className="mb-6">
        <img
          src="/assets/accessories/bulk.jpg"
          alt="Bulk order banner"
          className="w-full h-64 object-cover rounded shadow-md"
        />
      </div>

      <h2 className="text-2xl font-semibold text-green-700 mb-6">Bulk Orders</h2>

      <div className="grid gap-6">
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg font-medium mb-4">Bulk Order Request Form</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Company/Buyer Name *</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number *</label>
              <input
                type="tel"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10,15}"
                title="Enter 10-15 digit contact number"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Tea Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Tea Type *</label>
              <select
                name="teaType"
                value={form.teaType}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>Select tea</option>
                {TEA_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Packaging */}
            <div>
              <label className="block text-sm font-medium mb-1">Packaging *</label>
              <select
                name="packaging"
                value={form.packaging}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>Select packaging</option>
                {PACKAGING.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-1">Quantity (kg) *</label>
              <input
                type="number"
                name="quantityKg"
                min={50}
                value={form.quantityKg}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-sm font-medium mb-1">Unit Price</label>
              <input
                value={unitPrice ? fmt(unitPrice) : "Select tea to see price"}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Estimated Total */}
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Total</label>
              <input
                value={fmt(estimatedTotal)}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* File Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Upload Documents (optional)</label>
              <input
                type="file"
                multiple
                onChange={handleFiles}
                className="w-full border rounded px-3 py-2"
              />
              <div className="text-sm text-gray-500 mt-1">Company profile, tax/VAT certificates, etc.</div>
              {files.length > 0 && (
                <ul className="mt-2 text-sm text-gray-700">
                  {files.map((f, i) => <li key={i}>{f.name}</li>)}
                </ul>
              )}
            </div>

            {/* Submit */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow transition"
              >
                {submitting ? "Submitting..." : "Submit Bulk Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
