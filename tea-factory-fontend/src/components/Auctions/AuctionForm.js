import React, { useState } from "react";

export default function AuctionForm({ onClose }) {
  const [formData, setFormData] = useState({
    auctionId: "",
    startDate: "",
    endDate: "",
    minBid: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/auctions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Auction created successfully!");
        onClose();
      } else {
        alert("⚠️ Failed: " + data.error);
      }
    } catch (err) {
      console.error("Error creating auction:", err);
      alert("❌ Error creating auction");
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-6">
      <h5 className="text-lg font-semibold text-green-700 mb-4">
        Create Auction
      </h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Auction ID (custom)
          </label>
          <input
            type="text"
            name="auctionId"
            placeholder="Enter auction ID"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={formData.auctionId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Start Date
          </label>
          <input
            type="datetime-local"
            name="startDate"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            End Date
          </label>
          <input
            type="datetime-local"
            name="endDate"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Minimum Bid (LKR)
          </label>
          <input
            type="number"
            name="minBid"
            placeholder="Enter minimum bid"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={formData.minBid}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            Create
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
