import React, { useEffect, useState } from "react";
import AuctionForm from "./AuctionForm";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/api";

export default function AuctionsList() {
  const [auctions, setAuctions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [closing, setClosing] = useState({});
  const [deleting, setDeleting] = useState({});

  const fetchAuctions = async () => {
    try {
      const data = await apiFetch("/api/auctions");
      if (data?.success) setAuctions(data.auctions);
      else toast.error(data?.error || "Failed to fetch auctions");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Network error while fetching auctions");
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleDelete = async (auction) => {
    if (!auction || auction.status !== "Closed") return;
    if (!window.confirm("Delete this closed auction? This cannot be undone.")) return;
    try {
      setDeleting((s) => ({ ...s, [auction._id]: true }));
      const data = await apiFetch(`/api/auctions/${auction._id}`, { method: "DELETE" });
      if (data?.success) {
        toast.success("Auction deleted");
        fetchAuctions();
      } else {
        toast.error(data?.error || "Failed to delete auction");
      }
    } catch (e) {
      toast.error(e.message || "Error deleting auction");
    } finally {
      setDeleting((s) => ({ ...s, [auction._id]: false }));
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl p-6 bg-white shadow-sm rounded-xl mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-green-700">Auctions</h3>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={() => setShowForm(true)}
          >
            + New Auction
          </button>
        </div>

        {showForm && (
          <AuctionForm
            onClose={() => {
              setShowForm(false);
              fetchAuctions();
            }}
          />
        )}

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-green-100 text-left font-medium text-gray-800">
              <tr>
                <th className="px-3 py-2 border-b">Auction ID</th>
                <th className="px-3 py-2 border-b">Order</th>
                <th className="px-3 py-2 border-b">Start</th>
                <th className="px-3 py-2 border-b">End</th>
                <th className="px-3 py-2 border-b">Min Bid</th>
                <th className="px-3 py-2 border-b">Highest Bid</th>
                <th className="px-3 py-2 border-b">Highest Bidder</th>
                <th className="px-3 py-2 border-b">Status</th>
                <th className="px-3 py-2 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {auctions.length > 0 ? (
                auctions.map((auction) => (
                  <tr key={auction._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b">{auction.auctionId}</td>
                    <td className="px-3 py-2 border-b">{auction.orderId?.product || "-"}</td>
                    <td className="px-3 py-2 border-b">{new Date(auction.startDate).toLocaleString()}</td>
                    <td className="px-3 py-2 border-b">{new Date(auction.endDate).toLocaleString()}</td>
                    <td className="px-3 py-2 border-b">{auction.minBid}</td>
                    <td className="px-3 py-2 border-b">{auction.highestBid}</td>
                    <td className="px-3 py-2 border-b">{auction.highestBidder || "-"}</td>
                    <td className="px-3 py-2 border-b">{auction.status}</td>
                    <td className="px-3 py-2 border-b text-center">
                      {auction.status === "Open" && (
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                          disabled={!!closing[auction._id]}
                          onClick={async () => {
                            try {
                              setClosing((s) => ({ ...s, [auction._id]: true }));
                              const data = await apiFetch(`/api/auctions/${auction._id}/close`, { method: "PUT" });
                              if (data?.success) toast.success("Auction closed");
                              else toast.error(data?.error || "Failed to close auction");
                              fetchAuctions();
                            } catch (e) {
                              toast.error(e.message || "Error closing auction");
                            } finally {
                              setClosing((s) => ({ ...s, [auction._id]: false }));
                            }
                          }}
                        >
                          {closing[auction._id] ? "Closing…" : "Close"}
                        </button>
                      )}
                      {auction.status === "Closed" && (
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 ml-2"
                          disabled={!!deleting[auction._id]}
                          onClick={() => handleDelete(auction)}
                        >
                          {deleting[auction._id] ? "Deleting…" : "Delete"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No auctions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
