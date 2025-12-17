// src/components/Orders/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function OrderDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const API_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/${id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.order);
        } else {
          alert("❌ Failed to fetch order: " + data.error);
        }
      } catch (err) {
        console.error(err);
        alert("❌ Error fetching order");
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p>Loading order details...</p>;

  // 👉 Generate PDF with order details
  const handleDownloadDetails = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Order Details", 20, 20);

    doc.setFontSize(12);
    doc.text(`Customer Name: ${order.customerName}`, 20, 40);
    doc.text(`Email: ${order.customerEmail}`, 20, 50);
    doc.text(`Contact: ${order.contactNumber || "-"}`, 20, 60);
    doc.text(`Product: ${order.product}`, 20, 70);
    doc.text(`Quantity: ${order.quantity}`, 20, 80);
    doc.text(`Specifications: ${order.productSpecs || "-"}`, 20, 90);
    doc.text(`Delivery Instructions: ${order.deliveryInstructions || "-"}`, 20, 100);
    doc.text(`Status: ${order.status}`, 20, 110);

    doc.save(`Order_${order._id}_Details.pdf`);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-success mb-3">Order Details</h2>

      <div className="card p-3 mb-3">
        <p><strong>Customer Name:</strong> {order.customerName}</p>
        <p><strong>Email:</strong> {order.customerEmail}</p>
        <p><strong>Contact:</strong> {order.contactNumber || "-"}</p>
        <p><strong>Product:</strong> {order.product}</p>
        <p><strong>Quantity:</strong> {order.quantity}</p>
        <p><strong>Specifications:</strong> {order.productSpecs || "-"}</p>
        <p><strong>Delivery Instructions:</strong> {order.deliveryInstructions || "-"}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>

      {/* ✅ Updated button color to green */}
      <button
        className="btn me-2"
        style={{ backgroundColor: "green", color: "white" }}
        onClick={handleDownloadDetails}
        >
        Download Order Details
        </button>


      {/* Invoice Download (only if confirmed) */}
      {order.status === "Confirmed" ? (
        <a
          href={`${API_URL}/api/orders/${order._id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success me-2"
        >
          Download Invoice PDF
        </a>
      ) : (
        <span className="text-muted me-2">Invoice not available</span>
      )}

      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}
