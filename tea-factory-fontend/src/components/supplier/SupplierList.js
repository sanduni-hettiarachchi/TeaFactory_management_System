import React, { useEffect, useState } from "react";
import axios from "axios";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
    vehicleType: "",
    vehicleNumber: "",
    status: "Unregistered",
  });
  const [errors, setErrors] = useState({});

  // ✅ Email form states
  const [emailForm, setEmailForm] = useState({
    email: "",
    subject: "Registered Suppliers Report",
    message:
      "Dear Supplier,\n\nPlease find attached the registered suppliers report.\n\nBest regards,\nRanaya Tea Factory",
  });
  const [statusMsg, setStatusMsg] = useState("");

  // ✅ Fetch suppliers
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/Suplier/all");
      setSuppliers(res.data);
    } catch (error) {
      console.error("Error fetching suppliers", error);
    }
  };

  // ✅ Handle supplier form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validate
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email.";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.vehicleType.trim())
      newErrors.vehicleType = "Vehicle type required.";
    if (!formData.vehicleNumber.trim())
      newErrors.vehicleNumber = "Vehicle number required.";
    else if (!/^[A-Z]{2,3}-[A-Z]{1,3}-\d{3,4}$/i.test(formData.vehicleNumber))
      newErrors.vehicleNumber =
        "Invalid vehicle number format (e.g. WP-ABC-1234)";
    return newErrors;
  };

  // ✅ Edit supplier
  const handleEdit = (supplier) => {
    setEditingSupplier(supplier._id);
    setFormData({ ...supplier });
  };

  // ✅ Update supplier
  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.put(
        `http://localhost:3001/api/Suplier/update/${editingSupplier}`,
        formData
      );
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (error) {
      console.error("Error updating supplier", error);
    }
  };

  // ✅ Delete supplier
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this supplier?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/Suplier/delete/${id}`);
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier", error);
    }
  };

  // ✅ Confirm / Unregister supplier
  const toggleStatus = async (supplier) => {
    try {
      await axios.put(
        `http://localhost:3001/api/Suplier/update/${supplier._id}`,
        {
          ...supplier,
          status:
            supplier.status === "Registered" ? "Unregistered" : "Registered",
        }
      );
      fetchSuppliers();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // ✅ Email form handling
  const handleEmailChange = (e) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("Sending...");
    try {
      const res = await axios.post(
        "http://localhost:3001/api/email/send-supplier-email",
        emailForm
      );
      if (res.data.success) {
        setStatusMsg("✅ Email sent successfully!");
      } else {
        setStatusMsg("❌ Failed to send email");
      }
    } catch (err) {
      setStatusMsg("❌ Error sending email");
    }
  };

  // ✅ Send email directly for supplier row
  const handleSendDirectEmail = async (supplierEmail) => {
    setStatusMsg(`Sending PDF to ${supplierEmail}...`);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/email/send-supplier-email",
        {
          email: supplierEmail,
          subject: "Registered Suppliers Report",
          message:
            "Dear Supplier,\n\nPlease find attached the registered suppliers report.\n\nBest regards,\nRanaya Tea Factory",
        }
      );
      if (res.data.success) {
        setStatusMsg(`✅ Email sent successfully to ${supplierEmail}!`);
      } else {
        setStatusMsg(`❌ Failed to send email to ${supplierEmail}`);
      }
    } catch (err) {
      setStatusMsg(`❌ Error sending email to ${supplierEmail}`);
    }
  };

  // ✅ Filter suppliers
  const filteredSuppliers = suppliers.filter((s) =>
    [s.name, s.email, s.vehicleNumber].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-green-700">Supplier Details</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email or vehicle number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full md:w-1/3"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded-lg shadow-lg">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Vehicle Type</th>
              <th className="p-3 text-left">Vehicle Number</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-100">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.subject}</td>
                <td className="p-3">{s.description}</td>
                <td className="p-3">{s.vehicleType}</td>
                <td className="p-3">{s.vehicleNumber}</td>
                <td className="p-3 font-semibold">
                  {s.status === "Registered" ? (
                    <span className="text-green-600">Registered</span>
                  ) : (
                    <span className="text-red-600">Unregistered</span>
                  )}
                </td>
                <td className="p-3 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(s)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleStatus(s)}
                    className={`px-2 py-1 rounded text-white text-sm ${
                      s.status === "Registered"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {s.status === "Registered" ? "Unregister" : "Confirm"}
                  </button>
                  {/*Direct Email Button */}
                  {s.status === "Registered" && (
                    <button
                      onClick={() => handleSendDirectEmail(s.email)}
                      className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                    >
                      Send PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*Status Message */}
      {statusMsg && (
        <div className="mt-4 text-center font-semibold">{statusMsg}</div>
      )}

      {/*Email Sending Form */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Send Registered Suppliers PDF (Custom Email)
        </h2>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Supplier Email</label>
            <input
              type="email"
              name="email"
              value={emailForm.email}
              onChange={handleEmailChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Subject</label>
            <input
              type="text"
              name="subject"
              value={emailForm.subject}
              onChange={handleEmailChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Message</label>
            <textarea
              name="message"
              value={emailForm.message}
              onChange={handleEmailChange}
              rows="4"
              className="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Send Email
          </button>
        </form>
      </div>

      {/* Edit Modal */}
      {editingSupplier && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-green-600 mb-4">
            Edit Supplier
          </h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            {Object.keys(formData).map((key) =>
              key !== "_id" && key !== "createdAt" && key !== "updatedAt" && key !== "__v" ? (
                <div key={key}>
                  <label className="block text-sm font-semibold capitalize">
                    {key}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    disabled={key === "email" || key === "status"}
                    readOnly={key === "email" || key === "status"}
                    className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-400 ${
                      key === "email" || key === "status"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-sm">{errors[key]}</p>
                  )}
                </div>
              ) : null
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-6 sticky bottom-0 bg-white py-3">
              <button
                type="button"
                onClick={() => setEditingSupplier(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    </div>
  );
};

export default SupplierList;
