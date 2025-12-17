import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MakeDelivery() {
  const [formData, setFormData] = useState({
    customerName: "",
    contactNumber: "",
    orderQuantity: "",
    product: "",
    status: "Pending",
    customerAddress: "",
    customerLocation: { lat: 6.9271, lng: 79.8612 }, // Default: Colombo
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers in customerName and product fields
    if ((name === "customerName" || name === "product") && /[^a-zA-Z\s]/.test(value)) {
      return; // ignore input if it contains non-letter characters
    }

    // Prevent letters in contactNumber field
    if (name === "contactNumber" && /[^0-9]/.test(value)) {
      return; // ignore input if it contains non-numeric characters
    }

    // Validate orderQuantity - only positive integers
    if (name === "orderQuantity") {
      // Allow empty string for clearing the field
      if (value === "") {
        setFormData({ ...formData, [name]: value });
        return;
      }
      // Only allow positive integers
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 1 || !Number.isInteger(parseFloat(value))) {
        return; // ignore invalid input
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("✅ Delivery created successfully!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        const errorData = await res.json();
        setMessage("❌ Error: " + errorData.message);
      }
    } catch (error) {
      setMessage("❌ Network error: " + error.message);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Card Header */}
          <div className="bg-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2"
                />
              </svg>
              Delivery Information
            </h2>
          </div>

          {/* Form Content */}
          <div className="px-6 py-6">
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
                  <span className="font-medium">
                    {message.replace(/[✅❌]\s/, "")}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    placeholder="Enter customer name"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

               <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
               Contact Number *
               </label>
               <input
               type="text"
               name="contactNumber"
               placeholder="Enter contact number"
               value={formData.contactNumber}
               onChange={handleChange}
               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
               required
               pattern="^\d{10}$"
               title="Contact number must be exactly 10 digits"
              />
             </div>
             </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product *
                  </label>
                  <input
                    type="text"
                    name="product"
                    placeholder="Enter product name"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Quantity *
                  </label>
                  <input
                    type="number"
                    name="orderQuantity"
                    placeholder="Enter quantity (min: 1)"
                    value={formData.orderQuantity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                    min="1"
                    step="1"
                    title="Order quantity must be a positive integer (minimum 1)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a positive whole number (e.g., 1, 2, 3...)
                  </p>
                </div>
              </div>

              {/* Customer Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Address *
                </label>
                <textarea
                  name="customerAddress"
                  placeholder="Enter delivery address"
                  value={formData.customerAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  rows="2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Full delivery address for GPS tracking
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-200 font-medium"
              >
                Create Delivery Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}