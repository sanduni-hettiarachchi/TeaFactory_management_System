import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../utils/api";

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function isSameDay(a, b = new Date()) {
  const da = new Date(a), db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function isSameWeek(a, b = new Date()) {
  const da = new Date(a), db = new Date(b);
  const dayMs = 24 * 60 * 60 * 1000;
  const startOfWeek = new Date(db);
  startOfWeek.setHours(0, 0, 0, 0);
  const diffToMon = (startOfWeek.getDay() + 6) % 7;
  startOfWeek.setTime(startOfWeek.getTime() - diffToMon * dayMs);
  const endOfWeek = new Date(startOfWeek.getTime() + 7 * dayMs);
  return da >= startOfWeek && da < endOfWeek;
}

function isSameMonth(a, b = new Date()) {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth();
}

export default function Sales() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/api/order");
        if (data?.success) setOrders(data.orders || []);
        else setError(data?.error || "Failed to fetch orders");
      } catch (e) {
        setError(e.message || "Network error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const metrics = useMemo(() => {
    const paid = orders;
    const todayOrders = paid.filter(o => isSameDay(o.createdAt));
    const weekOrders = paid.filter(o => isSameWeek(o.createdAt));
    const monthOrders = paid.filter(o => isSameMonth(o.createdAt));

    const todayRevenue = sum(todayOrders.map(o => Number(o.price || 0)));
    const weekRevenue = sum(weekOrders.map(o => Number(o.price || 0)));
    const monthRevenue = sum(monthOrders.map(o => Number(o.price || 0)));
    const pending = orders.filter(o => (o.status || "Pending") === "Pending");

    const productMap = new Map();
    for (const o of paid) {
      const key = o.product || "Unknown";
      const qty = Number(o.items || 1);
      productMap.set(key, (productMap.get(key) || 0) + qty);
    }
    const topProducts = Array.from(productMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const recent = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return {
      counts: {
        today: todayOrders.length,
        week: weekOrders.length,
        month: monthOrders.length,
      },
      revenue: { today: todayRevenue, week: weekRevenue, month: monthRevenue },
      pendingCount: pending.length,
      topProducts,
      recent,
    };
  }, [orders]);

  if (loading)
    return <div className="max-w-6xl mx-auto mt-6 px-4 text-gray-600">Loading sales...</div>;
  if (error)
    return <div className="max-w-6xl mx-auto mt-6 px-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <h2 className="text-green-700 font-semibold text-2xl mb-4">Sales Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Sales (Today)",
            count: metrics.counts.today,
            revenue: metrics.revenue.today,
          },
          {
            label: "Total Sales (This Week)",
            count: metrics.counts.week,
            revenue: metrics.revenue.week,
          },
          {
            label: "Total Sales (This Month)",
            count: metrics.counts.month,
            revenue: metrics.revenue.month,
          },
          {
            label: "Pending Orders",
            count: metrics.pendingCount,
            revenue: "Awaiting processing or delivery",
            pending: true,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
          >
            <h6 className="text-gray-500 text-sm">{item.label}</h6>
            <div className="text-2xl font-bold text-gray-800">{item.count}</div>
            <div className="text-sm text-gray-600">
              {item.pending
                ? item.revenue
                : `Revenue: LKR ${item.revenue.toLocaleString()}`}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top-Selling Products */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <h5 className="font-semibold text-lg mb-3 text-gray-700">
            Top-Selling Products
          </h5>
          {metrics.topProducts.length ? (
            (() => {
              const maxQty = Math.max(...metrics.topProducts.map(([, q]) => q), 1);
              return (
                <div className="space-y-3">
                  {metrics.topProducts.map(([name, qty]) => (
                    <div key={name}>
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>{name}</span>
                        <span className="font-semibold">{qty}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(qty / maxQty) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          ) : (
            <div className="text-gray-500 text-sm">No sales data yet</div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <h5 className="font-semibold text-lg mb-3 text-gray-700">
            Recent Transactions
          </h5>
          {metrics.recent.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-green-100 text-green-800">
                  <tr>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">Items</th>
                    <th className="px-3 py-2">Total (LKR)</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recent.map((o) => (
                    <tr key={o._id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-3 py-2">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-2">{o.customerName}</td>
                      <td className="px-3 py-2">{o.product}</td>
                      <td className="px-3 py-2">{o.items}</td>
                      <td className="px-3 py-2">{Number(o.price || 0).toLocaleString()}</td>
                      <td className="px-3 py-2">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No recent orders</div>
          )}
        </div>
      </div>

      {/* Revenue Mini Chart */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-6 p-4">
        <h5 className="font-semibold text-lg mb-3 text-gray-700">
          Revenue (Today / Week / Month)
        </h5>
        {(() => {
          const series = [
            { label: "Today", value: metrics.revenue.today },
            { label: "Week", value: metrics.revenue.week },
            { label: "Month", value: metrics.revenue.month },
          ];
          const maxVal = Math.max(...series.map((s) => s.value), 1);
          return (
            <div className="flex items-end justify-around h-48">
              {series.map((s) => (
                <div key={s.label} className="text-center flex-1">
                  <div
                    className="mx-auto bg-green-600 rounded-md transition-all"
                    style={{
                      height: `${Math.max(6, Math.round((s.value / maxVal) * 120))}px`,
                      width: "40px",
                    }}
                    title={`${s.label}: LKR ${s.value.toLocaleString()}`}
                  ></div>
                  <div className="text-sm font-semibold mt-2">{s.label}</div>
                  <div className="text-xs text-gray-500">
                    LKR {s.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
