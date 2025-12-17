import React, { useState } from "react";

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    plateNumber: "",
    model: "",
    capacity: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // clear error
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // make sure plateNumber has at least 4 chars
    if (formData.plateNumber.length < 4) {
      setError("Plate number must have at least 4 characters");
      return;
    }

    // ✅ get last 4 chars
    const lastFour = formData.plateNumber.slice(-4);

    // check duplicates
    const isDuplicate = vehicles.some(
      (v, index) => v.plateNumber.slice(-4) === lastFour && index !== editIndex
    );

    if (isDuplicate) {
      setError(`Another vehicle already uses the last 4 digits "${lastFour}"`);
      return;
    }

    if (editIndex !== null) {
      // update
      const updated = [...vehicles];
      updated[editIndex] = formData;
      setVehicles(updated);
      setEditIndex(null);
    } else {
      // add
      setVehicles([...vehicles, formData]);
    }

    // reset
    setFormData({ plateNumber: "", model: "", capacity: "" });
    setError("");
  };

  const handleDelete = (index) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setFormData(vehicles[index]);
    setEditIndex(index);
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {editIndex !== null ? "Edit Vehicle" : "Add Vehicle"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="plateNumber"
            placeholder="Plate Number"
            value={formData.plateNumber}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="model"
            placeholder="Vehicle Model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          {/* show error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editIndex !== null ? "Update Vehicle" : "Add Vehicle"}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Vehicles List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Plate Number</th>
              <th className="border px-4 py-2">Model</th>
              <th className="border px-4 py-2">Capacity</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No vehicles added yet.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{vehicle.plateNumber}</td>
                  <td className="border px-4 py-2">{vehicle.model}</td>
                  <td className="border px-4 py-2">{vehicle.capacity}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiclesPage;