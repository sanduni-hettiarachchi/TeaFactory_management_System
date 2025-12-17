import React from "react";

// Simple, dependency-free visualizations using CSS
const bars = [
  { label: "Ceylon Black Tea", value: 82, color: "#2e7d32" },
  { label: "Green Tea", value: 64, color: "#43a047" },
  { label: "Herbal Mix", value: 45, color: "#66bb6a" },
  { label: "Loose Leaf", value: 58, color: "#81c784" },
  { label: "Flavoured Tea", value: 39, color: "#a5d6a7" },
];

const kpis = [
  { title: "Customer Satisfaction", value: "4.7/5", hint: "Based on 2,100+ reviews" },
  { title: "On-time Delivery", value: "96%", hint: "SLA across last 90 days" },
  { title: "Repeat Orders", value: "68%", hint: "Of total monthly orders" },
];

export default function SalesOverview() {
  return (
    <div className="container mx-auto mt-6 px-4">
      <h2 className="text-green-600 text-2xl font-semibold mb-4">Sales Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.title} className="bg-white shadow-md rounded-md p-4 flex flex-col h-full">
            <div className="text-gray-500 text-sm font-semibold">{k.title}</div>
            <div className="text-3xl text-green-600 font-bold">{k.value}</div>
            <div className="text-gray-400 text-sm">{k.hint}</div>
          </div>
        ))}
      </div>

      {/* Category Sales */}
      <div className="bg-white shadow-md rounded-md mb-6 p-4">
        <h5 className="text-lg font-semibold mb-4">Top Categories (last 30 days)</h5>
        <div className="flex flex-col gap-3">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span>{b.label}</span>
                <span className="text-gray-500">{b.value}%</span>
              </div>
              <div className="bg-gray-200 rounded h-3">
                <div
                  className="rounded h-3 transition-all duration-400"
                  style={{ width: `${b.value}%`, background: b.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white shadow-md rounded-md p-4">
        <h5 className="text-lg font-semibold mb-4">Monthly Orders Trend</h5>
        <div className="flex items-end gap-2 h-40">
          {[48, 62, 55, 76, 70, 84].map((v, i) => (
            <div
              key={i}
              className="rounded opacity-85"
              style={{ width: 28, height: `${v}%`, backgroundColor: "#2e7d32" }}
            />
          ))}
        </div>
        <div className="flex justify-between text-gray-500 text-sm mt-2">
          {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
