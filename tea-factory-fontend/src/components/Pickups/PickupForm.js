import React, { useState } from "react";

export default function PickupForm({ onClose, onSaved, orders = [] }) {
  const [formData, setFormData] = useState({
    orderId: "",
    clientName: "",
    pickupDate: "",
    pickupTime: "",
    truckAssigned: "",
  });

  const API_URL = "http://localhost:3001";
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  // Ensure we don't render duplicate options which can trigger duplicate key warnings
  const uniqueOrders = hasOrders
    ? Array.from(
        new Map(
          orders
            .filter((o) => o && o._id)
            .map((o) => [o._id, o])
        ).values()
      )
    : [];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/pickups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Pickup scheduled successfully!");
        onSaved(data.pickup);
      } else {
        alert("❌ Failed: " + data.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error scheduling pickup");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 border rounded-lg bg-gray-50">
      <h3 className="text-green-700 text-xl font-semibold mb-4">Schedule Pickup</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <select
            name="orderId"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.orderId}
            onChange={handleChange}
            required
            disabled={!hasOrders}
          >
            <option value="">{hasOrders ? "Select Order" : "No orders available"}</option>
            {hasOrders &&
              uniqueOrders.map((order) => (
                  <option key={order._id} value={order._id}>
                    {order.customerName} - {order.product}
                  </option>
                ))}
          </select>
          {!hasOrders && (
            <p className="text-sm text-gray-500 mt-1">
              Create an order first, then schedule a pickup.
            </p>
          )}
        </div>

        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.clientName}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="pickupDate"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.pickupDate}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="pickupTime"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.pickupTime}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="truckAssigned"
          placeholder="Truck Assigned"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.truckAssigned}
          onChange={handleChange}
          required
        />

        <div className="flex space-x-2">
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${hasOrders && formData.orderId ? 'bg-green-600 hover:bg-green-700' : 'bg-green-300 cursor-not-allowed'}`}
            disabled={!hasOrders || !formData.orderId}
          >
            Schedule Pickup
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
