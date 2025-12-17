import React, { useEffect, useState } from "react";

export default function InvoicesList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/invoices`);
        const data = await res.json();
        if (data.success) {
          setInvoices(data.invoices || []);
        } else {
          console.error("Failed to fetch invoices:", data.error);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [API_URL]);

  return (
    <div className="container mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Invoices</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-green-100 text-left text-sm font-medium text-gray-700">
              <tr>
                <th className="px-3 py-2 border-b">Created At</th>
                <th className="px-3 py-2 border-b">Customer</th>
                <th className="px-3 py-2 border-b">Product</th>
                <th className="px-3 py-2 border-b">Quantity</th>
                <th className="px-3 py-2 border-b">Total (LKR)</th>
                <th className="px-3 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b">{new Date(inv.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2 border-b">{inv.customerName}</td>
                    <td className="px-3 py-2 border-b">{inv.product}</td>
                    <td className="px-3 py-2 border-b">{inv.quantity}</td>
                    <td className="px-3 py-2 border-b">
                      {typeof inv.totalAmount === "number" ? `LKR ${inv.totalAmount.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-3 py-2 border-b">
                      <a
                        href={`${API_URL}/api/orders/${inv.orderId}/invoice`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition text-sm"
                      >
                        Download Invoice
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No invoices yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
