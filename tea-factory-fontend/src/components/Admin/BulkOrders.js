import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/api";

export default function BulkOrders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState({}); // { [id]: { status, statusReason } }

  const fetchBulkOrders = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/bulk-orders");
      if (data && data.success) {
        setItems(data.items || []);
      } else {
        toast.error((data && data.error) || "Failed to fetch bulk orders");
      }
    } catch (e) {
      toast.error(e.message || "Network error fetching bulk orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulkOrders();
  }, []);

  const saveStatus = async (id) => {
    const payload = edit[id] || {};
    if (!payload.status) return toast.error("Select a status");
    try {
      const data = await apiFetch(`/api/bulk-orders/${id}/status`, {
        method: "PATCH",
        body: {
          status: payload.status,
          statusReason: payload.statusReason || "",
        },
      });
      if (data && data.success) {
        toast.success("Status updated");
        setEdit((s) => ({ ...s, [id]: undefined }));
        fetchBulkOrders();
      } else {
        toast.error((data && data.error) || "Failed to update status");
      }
    } catch (e) {
      toast.error(e.message || "Network error");
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Delete this bulk order? This cannot be undone.")) return;
    try {
      const data = await apiFetch(`/api/bulk-orders/${id}`, { method: "DELETE" });
      if (data && data.success) {
        toast.success("Deleted");
        setItems((list) => list.filter((x) => x._id !== id));
      } else {
        toast.error((data && data.error) || "Failed to delete");
      }
    } catch (e) {
      toast.error(e.message || "Network error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-green-700 font-semibold text-xl">Bulk Orders</h2>
        {loading && <span className="text-gray-500 text-sm">Refreshing…</span>}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-green-100 text-green-900">
            <tr>
              <th className="px-3 py-2 border">Company</th>
              <th className="px-3 py-2 border">Contact</th>
              <th className="px-3 py-2 border">Tea Type</th>
              <th className="px-3 py-2 border">Packaging</th>
              <th className="px-3 py-2 border">Quantity (kg)</th>
              <th className="px-3 py-2 border">Delivery</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border">Created</th>
              <th className="px-3 py-2 border w-[300px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  className="text-center text-gray-500 py-4 border"
                >
                  No bulk orders yet
                </td>
              </tr>
            )}

            {items.map((b) => (
              <tr key={b._id} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2 border">
                  <div className="font-medium">{b.companyName}</div>
                  <div className="text-xs text-gray-500">{b.email || "-"}</div>
                </td>
                <td className="px-3 py-2 border">
                  <div>{b.contactNumber}</div>
                  <div className="text-xs text-gray-500">
                    Docs: {Array.isArray(b.documents) ? b.documents.length : 0}
                  </div>
                </td>
                <td className="px-3 py-2 border">{b.teaType}</td>
                <td className="px-3 py-2 border">{b.packaging}</td>
                <td className="px-3 py-2 border text-center">
                  {Number(b.quantityKg || 0)}
                </td>
                <td className="px-3 py-2 border">
                  {b.deliveryDate
                    ? new Date(b.deliveryDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-3 py-2 border">
                  <div className="flex flex-col gap-1">
                    <select
                      className="border rounded-md text-sm px-2 py-1"
                      value={
                        edit[b._id]?.status ?? b.status ?? "Submitted"
                      }
                      onChange={(e) =>
                        setEdit((s) => ({
                          ...s,
                          [b._id]: {
                            ...(s[b._id] || {}),
                            status: e.target.value,
                          },
                        }))
                      }
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    {(edit[b._id]?.status ?? b.status) === "Rejected" && (
                      <input
                        className="border rounded-md text-sm px-2 py-1"
                        placeholder="Reason (optional)"
                        value={edit[b._id]?.statusReason || ""}
                        onChange={(e) =>
                          setEdit((s) => ({
                            ...s,
                            [b._id]: {
                              ...(s[b._id] || {}),
                              statusReason: e.target.value,
                            },
                          }))
                        }
                      />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 border text-sm text-gray-600">
                  {b.createdAt
                    ? new Date(b.createdAt).toLocaleString()
                    : "-"}
                </td>
                <td className="px-3 py-2 border">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => saveStatus(b._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => removeItem(b._id)}
                      className="border border-red-600 text-red-600 hover:bg-red-50 text-xs font-medium px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
