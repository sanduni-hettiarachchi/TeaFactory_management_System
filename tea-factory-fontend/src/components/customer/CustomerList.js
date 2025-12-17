import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";  
import { FaFileAlt } from "react-icons/fa";


const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    country: "",
    businessType: "",
    teaProducts: "",
    monthlyRequirement: "",
    additionalNotes: "",
  });

  // ✅ Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/customer/getCustomer");
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/customer/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer", err);
    }
  };

  // ✅ Confirm
  const handleConfirm = async (id) => {
    try {
      await axios.patch(`http://localhost:3001/api/customer/${id}/confirm`);
      fetchCustomers();
    } catch (err) {
      console.error("Error confirming customer", err);
    }
  };

  // ✅ Open edit modal
  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      companyName: customer.companyName,
      contactPerson: customer.contactPerson,
      email: customer.email,
      phone: customer.phone,
      country: customer.country,
      businessType: customer.businessType,
      teaProducts: customer.teaProducts?.join(", "),
      monthlyRequirement: customer.monthlyRequirement,
      additionalNotes: customer.additionalNotes,
    });
  };

  // ✅ Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/customer/${editingCustomer._id}`, {
        ...formData,
        teaProducts: formData.teaProducts.split(",").map((p) => p.trim()),
      });
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      console.error("Error updating customer", err);
    }
  };

  // ✅ Export Registered Customers to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Registered Customers Report", 14, 10);

    const registered = customers.filter((c) => c.status === "Registered");
    const tableColumn = [
      "Company",
      "Contact",
      "Email",
      "Phone",
      "Country",
      "Business",
      "Products",
      "Requirement",
    ];
    const tableRows = registered.map((cust) => [
        cust.companyName,
        cust.contactPerson,
        cust.email,
        cust.phone,
        cust.country,
        cust.businessType,
        cust.teaProducts?.join(", "),
        cust.monthlyRequirement,
    ]);
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save("Registered_Customers.pdf");
  };

  // ✅ Export Registered Customers to Excel / CSV
  const exportExcel = () => {
    const registered = customers.filter((c) => c.status === "Registered");
    const worksheet = XLSX.utils.json_to_sheet(registered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RegisteredCustomers");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Registered_Customers.xlsx");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        Customer Management
      </h2>

      {/* Export Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
        >
          <FaFileAlt className="text-white text-lg" />
          Download PDF
        </button>
        <button
          onClick={exportExcel}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
        >
          <FaFileAlt className="text-white text-lg" />
          Download Excel/CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-green-600 text-white text-md">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Company</th>
              <th className="py-2 px-4 border">Contact</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Country</th>
              <th className="py-2 px-4 border">Business</th>
              <th className="py-2 px-4 border">Products</th>
              <th className="py-2 px-4 border">Requirement</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((cust, index) => (
                <tr key={cust._id} className="text-center hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{cust.companyName}</td>
                  <td className="py-2 px-4 border">{cust.contactPerson}</td>
                  <td className="py-2 px-4 border">{cust.email}</td>
                  <td className="py-2 px-4 border">{cust.phone}</td>
                  <td className="py-2 px-4 border">{cust.country}</td>
                  <td className="py-2 px-4 border">{cust.businessType}</td>
                  <td className="py-2 px-4 border">{cust.teaProducts?.join(", ")}</td>
                  <td className="py-2 px-4 border">{cust.monthlyRequirement}</td>
                  <td
                    className={`py-2 px-4 border font-bold ${
                      cust.status === "Registered"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {cust.status}
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    {cust.status === "Unregistered" && (
                      <button
                        onClick={() => handleConfirm(cust._id)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(cust)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 mt-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cust._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 mt-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-green-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold mb-6 text-green-600 border-b pb-2">
              Edit Customer
            </h3>
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-6">
              {Object.keys(formData).map((key) => (
                <div key={key} className="col-span-1">
                  <label className="block text-sm font-semibold capitalize mb-1 text-gray-700">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm"
                  />
                </div>
              ))}

              <div className="col-span-2 flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-600 shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 shadow"
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

export default CustomerList;
