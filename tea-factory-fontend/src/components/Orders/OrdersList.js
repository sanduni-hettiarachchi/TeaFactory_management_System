import React, { useEffect, useState } from "react";
import OrderForm from "../Orders/OrderForm";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const API_URL = "http://localhost:3001";

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/order`);
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

  const handleConfirmAndGenerateInvoice = async (order) => {
    try {
      setUpdatingId(order._id);
      const res = await fetch(`${API_URL}/api/order/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Confirmed" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Order confirmed and invoice generated.");
        await fetchOrders();
      } else {
        alert("❌ Failed to confirm order: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error confirming order:", err);
      alert("❌ Error confirming order");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (order, nextStatus) => {
    if (!nextStatus || nextStatus === order.status) return;
    try {
      setUpdatingId(order._id);
      const res = await fetch(`${API_URL}/api/order/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) await fetchOrders();
      else alert("❌ Failed to update status: " + (data.error || "Unknown error"));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("❌ Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFormClose = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleOrderSaved = () => {
    fetchOrders();
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`${API_URL}/api/order/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setOrders(orders.filter((o) => o._id !== id));
      else alert("❌ Failed to delete order: " + data.error);
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("❌ Error deleting order");
    }
  };

  const handleRowClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Orders</h2>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4"
        onClick={() => setShowForm(true)}
      >
        + Add New Order
      </button>

      {showForm && (
        <OrderForm
          order={editingOrder}
          onClose={handleFormClose}
          onSaved={handleOrderSaved}
        />
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-green-100 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="px-3 py-2 border-b">Customer Name</th>
              <th className="px-3 py-2 border-b">Email</th>
              <th className="px-3 py-2 border-b">Contact</th>
              <th className="px-3 py-2 border-b">Product</th>
              <th className="px-3 py-2 border-b">Quantity</th>
              <th className="px-3 py-2 border-b">Price (LKR)</th>
              <th className="px-3 py-2 border-b">Specifications</th>
              <th className="px-3 py-2 border-b">Delivery Instructions</th>
              <th className="px-3 py-2 border-b">Status</th>
              <th className="px-3 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    onClick={() => handleRowClick(order._id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-3 py-2 border-b">{order.customerName}</td>
                    <td className="px-3 py-2 border-b">{order.customerEmail}</td>
                    <td className="px-3 py-2 border-b">{order.contactNumber || "-"}</td>
                    <td className="px-3 py-2 border-b">{order.product}</td>
                    <td className="px-3 py-2 border-b">{order.quantity}</td>
                    <td className="px-3 py-2 border-b">
                      {typeof order.price === "number"
                        ? `LKR ${order.price.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="px-3 py-2 border-b">{order.productSpecs || "-"}</td>
                    <td className="px-3 py-2 border-b">{order.deliveryInstructions || "-"}</td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-2 border-b"
                    >
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 border-b gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 mb-1 rounded-md text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingOrder(order);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      {order.status !== "Confirmed" &&
                        typeof order.price === "number" &&
                        order.price > 0 && (
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 mb-1 rounded-md text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmAndGenerateInvoice(order);
                            }}
                          >
                            Confirm
                          </button>
                        )}
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 mb-1 rounded-md text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expandedOrderId === order._id && (
                    <tr>
                      <td colSpan="10" className="bg-gray-50 p-4">
                        <strong>Order Details:</strong>
                        <div>Customer: {order.customerName}</div>
                        <div>Email: {order.customerEmail}</div>
                        <div>Contact: {order.contactNumber || "-"}</div>
                        <div>Product: {order.product}</div>
                        <div>Quantity: {order.quantity}</div>
                        <div>
                          Price:{" "}
                          {typeof order.price === "number"
                            ? `LKR ${order.price.toLocaleString()}`
                            : "-"}
                        </div>
                        <div>Specs: {order.productSpecs || "-"}</div>
                        <div>Delivery Instructions: {order.deliveryInstructions || "-"}</div>
                        <div>Status: {order.status}</div>

                        <div className="mt-2 flex gap-2">
                          {typeof order.price === "number" && order.price > 0 && (
                            <a
                              href={`${API_URL}/api/order/${order._id}/invoice`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Download Invoice
                            </a>
                          )}
                          <a
                            href={`${API_URL}/api/order/${order._id}/details-pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Download Order Details
                          </a>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
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
