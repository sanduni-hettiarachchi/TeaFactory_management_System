// src/drivers/DriversPage.jsx
/*import React, { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "dms_drivers_v1";

function makeId() {
  // simple unique id (ok for local-only storage)
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ name: "", license: "", phone: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Load drivers from localStorage on first render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setDrivers(parsed);
          console.log("[DriversPage] loaded drivers from localStorage:", parsed);
        } else {
          console.warn("[DriversPage] localStorage data not an array, ignoring.");
        }
      } else {
        console.log("[DriversPage] no drivers in localStorage yet.");
      }
    } catch (err) {
      console.error("[DriversPage] error reading localStorage:", err);
    }
  }, []);

  // Save drivers to localStorage whenever drivers state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drivers));
      console.log("[DriversPage] saved drivers to localStorage:", drivers);
    } catch (err) {
      console.error("[DriversPage] error saving to localStorage:", err);
    }
  }, [drivers]);

  // Handle input change
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  // Add or update driver
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.name.trim() || !form.license.trim() || !form.phone.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    // Optional: prevent duplicate license numbers
    const duplicate = drivers.find(
      (d) => d.license.toLowerCase() === form.license.trim().toLowerCase() && d.id !== editId
    );
    if (duplicate) {
      setError("A driver with this license already exists.");
      return;
    }

    if (editId) {
      // update by id
      const updated = drivers.map((d) =>
        d.id === editId ? { ...d, name: form.name.trim(), license: form.license.trim(), phone: form.phone.trim() } : d
      );
      setDrivers(updated);
      setEditId(null);
    } else {
      // add new
      const newDriver = {
        id: makeId(),
        name: form.name.trim(),
        license: form.license.trim(),
        phone: form.phone.trim(),
        createdAt: new Date().toISOString(),
      };
      setDrivers((prev) => [...prev, newDriver]);
    }

    // reset form
    setForm({ name: "", license: "", phone: "" });
  };

  const handleEdit = (id) => {
    const d = drivers.find((x) => x.id === id);
    if (!d) return;
    setForm({ name: d.name, license: d.license, phone: d.phone });
    setEditId(id);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ name: "", license: "", phone: "" });
    setError("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this driver?")) return;
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    // If deleting the driver being edited, cancel edit
    if (editId === id) handleCancelEdit();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">{editId ? "Edit Driver" : "Add Driver"}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
              placeholder="Driver name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License</label>
            <input
              name="license"
              value={form.license}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
              placeholder="License number"
              pattern="^\d{8}$"
               title="License number must be exactly 8 digits"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
              placeholder="Phone number"
              required
              pattern="^\d{10}$"
              title="Contact number must be exactly 10 digits"
             
            />
          </div>

          <div className="md:col-span-3 flex items-center space-x-3">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editId ? "Update Driver" : "Add Driver"}
            </button>
            {editId && (
              <button type="button" onClick={handleCancelEdit} className="px-4 py-2 border rounded">
                Cancel
              </button>
            )}
            {error && <p className="text-red-600 ml-4">{error}</p>}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Drivers List ({drivers.length})</h2>

        {drivers.length === 0 ? (
          <div className="text-gray-500">No drivers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">License</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Added</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="px-4 py-2">{d.name}</td>
                    <td className="px-4 py-2">{d.license}</td>
                    <td className="px-4 py-2">{d.phone}</td>
                    <td className="px-4 py-2">{new Date(d.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded mr-2" onClick={() => handleEdit(d.id)}>
                        Edit
                      </button>
                      <button className="text-sm bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(d.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}*/