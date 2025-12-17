// src/pages/customer/CustomerAuctions.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/api";

export default function CustomerAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bidderName, setBidderName] = useState("");
  const [placing, setPlacing] = useState({});
  const [autoBid, setAutoBid] = useState({});
  const pollRef = useRef(null);

  const safeBidder = useMemo(() => bidderName.trim() || "Verified Buyer", [bidderName]);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/auctions");
      if (data && data.success) setAuctions(data.auctions || []);
      else toast.error((data && data.error) || "Failed to load auctions");
    } catch (e) {
      toast.error(e.message || "Network error loading auctions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
    pollRef.current = setInterval(fetchAuctions, 4000);
    return () => pollRef.current && clearInterval(pollRef.current);
  }, []);

  const placeBid = async (auctionId, amount) => {
    if (!amount || isNaN(Number(amount))) {
      toast.error("Enter a valid bid amount");
      return;
    }
    setPlacing((p) => ({ ...p, [auctionId]: true }));
    try {
      const data = await apiFetch(`/api/auctions/${auctionId}/bid`, {
        method: "POST",
        body: { bidderName: safeBidder, amount: Number(amount) },
      });
      if (data && data.success) {
        toast.success("Bid placed");
        fetchAuctions();
        return true;
      } else toast.error((data && data.error) || "Failed to place bid");
    } catch (e) {
      toast.error(e.message || "Error placing bid");
    } finally {
      setPlacing((p) => ({ ...p, [auctionId]: false }));
    }
    return false;
  };

  useEffect(() => {
    const handleAutoBid = async () => {
      for (const a of auctions) {
        const cfg = autoBid[a._id];
        if (!cfg || !cfg.enabled || a.status !== "Open") continue;
        const current = Number(a.highestBid || 0);
        const max = Number(cfg.max || 0);
        const step = Math.max(1, Number(cfg.step || 1));
        if (max > 0 && current < max) {
          const next = Math.min(current + step, max);
          if (a.highestBidder && a.highestBidder === safeBidder) continue;
          await placeBid(a._id, next);
        }
      }
    };
    handleAutoBid();
  }, [auctions]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Banner */}
      <div className="mb-6">
        <img
          src="/assets/accessories/Auction.jpg"
          alt="Auction banner"
          className="w-full h-64 object-cover rounded shadow-md"
        />
      </div>

      <h2 className="text-2xl font-semibold text-green-700 mb-4">Customer Auctions</h2>

      {/* Bidder Name */}
      <div className="bg-white rounded shadow p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium">Your Bidder Name</label>
          <input
            type="text"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Company / Buyer Name"
            value={bidderName}
            onChange={(e) => setBidderName(e.target.value)}
          />
          <span className="text-gray-500 text-sm">Used on bids and auto-bids</span>
        </div>
      </div>

      {/* Live Catalog */}
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-lg font-medium">Live Catalog</h5>
        {loading && <span className="text-gray-500 text-sm">Refreshing…</span>}
      </div>

      {/* Auction Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-green-100">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-medium">Product</th>
              <th className="px-3 py-2 text-left text-sm font-medium">Quantity (kg)</th>
              <th className="px-3 py-2 text-left text-sm font-medium">Min Bid</th>
              <th className="px-3 py-2 text-left text-sm font-medium">Highest Bid</th>
              <th className="px-3 py-2 text-left text-sm font-medium">Highest Bidder</th>
              <th className="px-3 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-3 py-2 text-left text-sm font-medium" style={{ width: 300 }}>Bid</th>
              <th className="px-3 py-2 text-left text-sm font-medium" style={{ width: 360 }}>Auto-Bid</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auctions.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">
                  No auctions available
                </td>
              </tr>
            )}
            {auctions.map((a) => {
              const cfg = autoBid[a._id] || { enabled: false, max: "", step: 100 };
              return (
                <AuctionRow
                  key={a._id}
                  auction={a}
                  bidderName={safeBidder}
                  placing={!!placing[a._id]}
                  cfg={cfg}
                  onChangeCfg={(next) => setAutoBid((s) => ({ ...s, [a._id]: next }))}
                  onBid={placeBid}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuctionRow({ auction, bidderName, placing, cfg, onChangeCfg, onBid }) {
  const [amount, setAmount] = useState("");
  const [localCfg, setLocalCfg] = useState(cfg);

  useEffect(() => setLocalCfg(cfg), [cfg]);

  const applyCfg = (patch) => {
    const next = { ...localCfg, ...patch };
    setLocalCfg(next);
    onChangeCfg(next);
  };

  const minNextBid = Math.max(Number(auction.minBid || 0), Number(auction.highestBid || 0) + 1);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 py-2">
        <div className="font-semibold">{auction.orderId?.product || "Tea"}</div>
        <div className="text-sm text-gray-500">{auction.orderId?.productSpecs || "—"}</div>
      </td>
      <td className="px-3 py-2">{Number(auction.orderId?.quantity || 0)}</td>
      <td className="px-3 py-2">LKR {Number(auction.minBid || 0).toLocaleString()}</td>
      <td className="px-3 py-2 font-semibold">LKR {Number(auction.highestBid || 0).toLocaleString()}</td>
      <td className="px-3 py-2">{auction.highestBidder || "-"}</td>
      <td className="px-3 py-2">
        {auction.status}
        <div className="text-sm text-gray-500">
          {new Date(auction.startDate).toLocaleString()} → {new Date(auction.endDate).toLocaleString()}
        </div>
      </td>

      {/* Bid */}
      <td className="px-3 py-2">
        <div className="flex gap-1">
          <span className="inline-flex items-center px-2 border border-gray-300 bg-gray-100 rounded-l text-sm">LKR</span>
          <input
            type="number"
            className="flex-1 border-t border-b border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            min={minNextBid}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`≥ ${minNextBid}`}
            disabled={auction.status !== "Open"}
          />
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:bg-gray-300"
            disabled={auction.status !== "Open" || placing}
            onClick={() => onBid(auction._id, Number(amount || 0))}
          >
            {placing ? "Placing…" : "Place Bid"}
          </button>
        </div>
      </td>

      {/* Auto-Bid */}
      <td className="px-3 py-2">
        <div className="flex flex-col gap-2">
          {/* Enable Switch */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={!!localCfg.enabled}
              onChange={(e) => applyCfg({ enabled: e.target.checked })}
              disabled={auction.status !== "Open"}
            />
            Enable auto-bid (proxy)
          </label>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs">Max</label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={localCfg.max || ""}
                min={minNextBid}
                onChange={(e) => applyCfg({ max: Number(e.target.value) })}
                placeholder={`≥ ${minNextBid}`}
                disabled={!localCfg.enabled || auction.status !== "Open"}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs">Step</label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={localCfg.step || 100}
                min={1}
                onChange={(e) => applyCfg({ step: Number(e.target.value) })}
                disabled={!localCfg.enabled || auction.status !== "Open"}
              />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Auto-bid will place the next valid bid up to your Max using the given Step when you are outbid.
          </div>
        </div>
      </td>
    </tr>
  );
}
