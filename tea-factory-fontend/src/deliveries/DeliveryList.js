import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DeliveryList() {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  // Fetch all deliveries
  const fetchDeliveries = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/deliveries");
      const data = await res.json();
      setDeliveries(data);
      setFilteredDeliveries(data);
    } catch (error) {
      setMessage("❌ Error fetching deliveries: " + error.message);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // Filter deliveries based on search term & status
  useEffect(() => {
    let filtered = deliveries;

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          (d.customerName && d.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (d.product && d.product.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (d.contactNumber && d.contactNumber.includes(searchTerm))
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    setFilteredDeliveries(filtered);
  }, [searchTerm, statusFilter, deliveries]);

  // Delete delivery
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this delivery?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/deliveries/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("✅ Delivery deleted successfully");
        fetchDeliveries();
      } else {
        const errorData = await res.json();
        setMessage("❌ Error: " + errorData.message);
      }
    } catch (error) {
      setMessage("❌ Network error: " + error.message);
    }
  };

  // Update delivery status
  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3001/api/deliveries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Show special message for completed deliveries
        if (status === "Delivered") {
          setMessage("🎉 Delivery completed successfully! Great job!");
        } else if (status === "Out for Delivery") {
          setMessage("🚚 Delivery is now out for delivery");
        } else if (status === "Cancelled") {
          setMessage("❌ Delivery has been cancelled");
        } else {
          setMessage("✅ Status updated successfully");
        }
        fetchDeliveries();
      } else {
        const errorData = await res.json();
        setMessage("❌ Error: " + errorData.message);
      }
    } catch (error) {
      setMessage("❌ Network error: " + error.message);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Out for Delivery": "bg-blue-100 text-blue-800 border-blue-200",
      "Delivered": "bg-green-100 text-green-800 border-green-200",
      "Cancelled": "bg-red-100 text-red-800 border-red-200",
    };
    return statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const generatePDF = () => {
    try {
      if (filteredDeliveries.length === 0) {
        setMessage("❌ No data to generate PDF");
        return;
      }

      console.log("Starting PDF generation...");
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.setTextColor(34, 77, 44);
      doc.text("Delivery Management Report", 14, 20);

      // Add date and filters info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Generated on: ${currentDate}`, 14, 28);

      let yPos = 36;

      if (searchTerm) {
        doc.text(`Search Term: "${searchTerm}"`, 14, yPos);
        yPos += 6;
      }

      if (statusFilter !== "All") {
        doc.text(`Status Filter: ${statusFilter}`, 14, yPos);
        yPos += 6;
      }

      // Status summary
      const statusCounts = filteredDeliveries.reduce((acc, delivery) => {
        acc[delivery.status] = (acc[delivery.status] || 0) + 1;
        return acc;
      }, {});

      if (Object.keys(statusCounts).length > 0) {
        doc.text("Status Summary:", 14, yPos);
        yPos += 6;
        Object.entries(statusCounts).forEach(([status, count]) => {
          doc.text(`  ${status}: ${count}`, 14, yPos);
          yPos += 6;
        });
        yPos += 4;
      }

      // Table headers & rows
      const tableColumn = ["Customer", "Contact", "Product", "Quantity", "Status"];
      const tableRows = filteredDeliveries.map((delivery) => [
        delivery.customerName || "N/A",
        delivery.contactNumber || "N/A",
        delivery.product || "N/A",
        delivery.orderQuantity ? delivery.orderQuantity.toString() : "0",
        delivery.status || "Pending",
      ]);

      console.log("Creating table with", tableRows.length, "rows");

      // Use autoTable function directly
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: yPos,
        theme: "grid",
        headStyles: {
          fillColor: [34, 77, 44],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        margin: { top: yPos },
      });

      // Footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 50,
          doc.internal.pageSize.height - 10
        );
      }

      // Save PDF
      const fileName = `Delivery_Report_${currentDate.replace(/\//g, "-")}.pdf`;
      console.log("Saving PDF:", fileName);
      doc.save(fileName);
      setMessage("✅ PDF report generated successfully!");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      setMessage(`❌ Error generating PDF: ${error.message}`);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-7 h-7 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2" />
                </svg>
                Delivery Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and track all delivery orders</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/drivers")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center shadow-sm"
                title="View Active Drivers & GPS Tracking"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Active Drivers
              </button>
              <button
                onClick={() => navigate("/make-delivery")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Delivery
              </button>
              <button
                onClick={generatePDF}
                disabled={filteredDeliveries.length === 0}
                className={`px-4 py-2 rounded-lg font-medium flex items-center transition duration-200 shadow-sm ${
                  filteredDeliveries.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-3 lg:space-y-0">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Deliveries
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by customer, product, or contact"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {(searchTerm || statusFilter !== "All") && (
                <div className="lg:self-end">
                  <button
                    onClick={clearFilters}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredDeliveries.length} of {deliveries.length} deliveries
            </span>
            {(searchTerm || statusFilter !== "All") && (
              <span className="text-green-600 font-medium">Filters applied</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Message Alert */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg border ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="flex items-center">
              <span className="text-lg mr-2">
                {message.startsWith("✅") ? "✅" : "❌"}
              </span>
              <span className="font-medium">{message.replace(/[✅❌]\s/, "")}</span>
              <button
                onClick={() => setMessage("")}
                className="ml-auto text-gray-400 hover:text-gray-600 transition duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Deliveries Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="bg-green-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              All Deliveries ({filteredDeliveries.length})
            </h2>
          </div>

          {filteredDeliveries.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {deliveries.length === 0 ? "No deliveries found" : "No matching deliveries"}
              </h3>
              <p className="text-gray-500 mb-6">
                {deliveries.length === 0 
                  ? "Get started by creating your first delivery order."
                  : "Try adjusting your search criteria or filters."
                }
              </p>
              {deliveries.length === 0 ? (
                <button
                  onClick={() => navigate("/make-delivery")}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium"
                >
                  Create First Delivery
                </button>
              ) : (
                <button
                  onClick={clearFilters}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDeliveries.map((delivery, index) => (
                    <tr key={delivery._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {/* Customer Details */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {delivery.customerName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {delivery.contactNumber}
                          </div>
                        </div>
                      </td>

                      {/* Order Information */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {delivery.product}
                          </div>
                          <div className="text-sm text-gray-500">
                            Quantity: {delivery.orderQuantity}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={delivery.status}
                          onChange={(e) => handleStatusChange(delivery._id, e.target.value)}
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(delivery.status)} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {delivery.status === "Out for Delivery" && (
                            <button
                              onClick={() => navigate("/drivers")}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center text-sm"
                              title="Track on GPS"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Track
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/deliveries/edit/${delivery._id}`)}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 flex items-center text-sm"
                            title="Edit Delivery"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(delivery._id)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 flex items-center text-sm"
                            title="Delete Delivery"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}