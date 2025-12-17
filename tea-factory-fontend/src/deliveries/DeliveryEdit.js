import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DeliveryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    contactNumber: "",
    product: "",
    orderQuantity: "",
    status: "Pending",
    driverId: "",
  });

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch delivery details and drivers
  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/api/deliveries/${id}`).then(r => r.json()),
      fetch('http://localhost:3001/api/drivers').then(r => r.json())
    ])
      .then(([deliveryData, driversData]) => {
        setForm({
          customerName: deliveryData.customerName,
          contactNumber: deliveryData.contactNumber,
          product: deliveryData.product,
          orderQuantity: deliveryData.orderQuantity,
          status: deliveryData.status,
          driverId: deliveryData.driverId || "",
        });
        setDrivers(driversData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/api/deliveries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("✅ Delivery updated successfully!");
        navigate("/DelList");
      } else {
        alert("❌ Failed to update delivery.");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Edit Delivery</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <input
                type="text"
                name="product"
                value={form.product}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Quantity
              </label>
              <input
                type="number"
                name="orderQuantity"
                value={form.orderQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Driver 🚚
              </label>
              <select
                name="driverId"
                value={form.driverId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">-- No Driver Assigned --</option>
                {drivers.map(driver => (
                  <option key={driver._id || driver.id} value={driver._id || driver.id}>
                    {driver.name} - {driver.license}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Assign a driver to enable GPS tracking
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Pending</option>
                <option>Out for Delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {saving ? "Saving..." : "✅ Update Delivery"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}