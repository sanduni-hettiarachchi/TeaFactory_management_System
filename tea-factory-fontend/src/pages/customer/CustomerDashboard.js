import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const API_URL = "http://localhost:3001";
  const customerEmail = localStorage.getItem("customerEmail") || "";

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const url = customerEmail
        ? `${API_URL}/api/order?customerEmail=${encodeURIComponent(customerEmail)}`
        : `${API_URL}/api/order`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        alert("❌ Failed to fetch orders: " + data.error);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("❌ Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const goToTeaOrder = () => navigate("/customer/orders/new");
  const goToAccessoriesOrder = () => navigate("/customer/orders/new/accessories");

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-green-700 mb-6">Customer Dashboard</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={goToTeaOrder}
        >
          + Create Order
        </button>
        <button
          className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
          onClick={goToAccessoriesOrder}
        >
          + Order Accessories
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-green-100">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-medium">Customer Name</th>
              <th className="px-3 py-2 text-left text-sm font-medium">Contact</th>
              <th className="px-3 py-2 text-left text-sm font-medium">Product</th>
              <th className="px-3 py-2 text-left text-sm font-medium">Quantity</th>
              <th className="px-3 py-2 text-left text-sm font-medium">Specifications</th>
              <th className="px-3 py-2 text-left text-sm font-medium">Delivery Instructions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{order.customerName}</td>
                  <td className="px-3 py-2">{order.contactNumber || "-"}</td>
                  <td className="px-3 py-2">{order.product}</td>
                  <td className="px-3 py-2">{order.quantity}</td>
                  <td className="px-3 py-2">{order.productSpecs || "-"}</td>
                  <td className="px-3 py-2">{order.deliveryInstructions || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
