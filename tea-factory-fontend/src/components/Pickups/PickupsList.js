import React, { useEffect, useState } from "react";
import PickupForm from "./PickupForm";

export default function PickupsList({ orders }) {
  const [pickups, setPickups] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const API_URL = "http://localhost:3001";

  const fetchPickups = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pickups`);
      const data = await res.json();
      if (res.ok && data.success) setPickups(data.pickups);
      else alert("❌ Failed to fetch pickups: " + data.error);
    } catch (err) {
      console.error(err);
      alert("❌ Error fetching pickups");
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleFormClose = () => setShowForm(false);

  const handlePickupSaved = (newPickup) => {
    setPickups([...pickups, newPickup]);
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-green-700 text-2xl font-semibold">Pickups</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          Schedule Pickup
        </button>
      </div>

      {showForm && (
        <PickupForm
          orders={orders}
          onClose={handleFormClose}
          onSaved={handlePickupSaved}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Client Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Order</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Time</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Truck</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pickups.length > 0 ? (
              pickups.map((pickup) => (
                <tr key={pickup._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{pickup.clientName}</td>
                  <td className="px-4 py-2">
                    {pickup.orderId?.customerName} - {pickup.orderId?.product}
                  </td>
                  <td className="px-4 py-2">{new Date(pickup.pickupDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{pickup.pickupTime}</td>
                  <td className="px-4 py-2">{pickup.truckAssigned}</td>
                  <td className="px-4 py-2">{pickup.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No pickups scheduled
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
