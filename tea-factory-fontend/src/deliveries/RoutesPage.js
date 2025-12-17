import React, { useState } from "react";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newRoute, setNewRoute] = useState({
    name: "",
    origin: "",
    destination: "",
  });

  const handleCreateRoute = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewRoute({ name: "", origin: "", destination: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoute((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate adding route (replace with backend call later)
    setRoutes((prev) => [...prev, newRoute]);
    handleModalClose();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Routes Management</h1>
        <button
          onClick={handleCreateRoute}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
        >
          Create New Route
        </button>
      </div>

      {/* Routes Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-green-700 text-white px-4 py-2 font-semibold">
          Existing Routes
        </div>

        {routes.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            <p className="text-lg font-medium mb-2">No routes found</p>
            <p>Create a route to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {routes.map((route, index) => (
              <li key={index} className="p-4">
                <strong>{route.name}</strong> — {route.origin} to {route.destination}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Create New Route</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Route Name</label>
                <input
                  type="text"
                  name="name"
                  value={newRoute.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Origin</label>
                <input
                  type="text"
                  name="origin"
                  value={newRoute.origin}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={newRoute.destination}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 border rounded text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Add Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}