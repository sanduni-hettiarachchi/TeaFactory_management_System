import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default function CustomerSales() {
  const monthlySales = [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 1500 },
    { month: "Mar", sales: 1800 },
    { month: "Apr", sales: 2200 },
    { month: "May", sales: 2500 },
    { month: "Jun", sales: 2800 },
  ];

  const teaTypes = [
    { name: "Black Tea", value: 45 },
    { name: "Green Tea", value: 25 },
    { name: "Herbal Tea", value: 20 },
    { name: "Others", value: 10 },
  ];

  const regionalSales = [
    { region: "Sri Lanka", sales: 1500 },
    { region: "Asia", sales: 3000 },
    { region: "Europe", sales: 2200 },
    { region: "USA", sales: 1800 },
  ];

  const yearlyTrend = [
    { year: 2021, sales: 8000 },
    { year: 2022, sales: 12000 },
    { year: 2023, sales: 16000 },
    { year: 2024, sales: 21000 },
  ];

  const totals = useMemo(() => {
    const totalPacks = 10500; 
    const totalRevenue = 12000000; 
    const customers = 7800; 
    return { totalPacks, totalRevenue, customers };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-1">Our Journey in Numbers</h1>
      <p className="text-center text-gray-500 mb-8">Discover how tea lovers worldwide have chosen us.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded p-6 text-center">
          <h5 className="font-semibold mb-2">Total Sales</h5>
          <div className="text-3xl text-green-700 font-bold">{totals.totalPacks.toLocaleString()}+</div>
          <div className="text-sm text-gray-500 mt-1">Tea Packs Sold Worldwide</div>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h5 className="font-semibold mb-2">Revenue</h5>
          <div className="text-3xl text-green-700 font-bold">LKR {totals.totalRevenue.toLocaleString()}+</div>
          <div className="text-sm text-gray-500 mt-1">Across Global Markets</div>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h5 className="font-semibold mb-2">Customers Served</h5>
          <div className="text-3xl text-green-700 font-bold">{totals.customers.toLocaleString()}+</div>
          <div className="text-sm text-gray-500 mt-1">And Counting!</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Monthly Sales */}
        <div className="bg-white shadow rounded p-4 h-full">
          <h5 className="text-center font-semibold mb-4">Monthly Sales Growth</h5>
          <div className="flex items-end justify-between h-64 gap-2">
            {(() => {
              const max = Math.max(...monthlySales.map(m => m.sales), 1);
              return monthlySales.map(m => (
                <div key={m.month} className="flex-1 text-center">
                  <div
                    className="bg-green-700 rounded"
                    style={{ height: Math.max(10, Math.round((m.sales / max) * 180)) }}
                    title={`${m.month}: ${m.sales.toLocaleString()}`}
                  />
                  <div className="text-sm font-semibold mt-2">{m.month}</div>
                  <div className="text-xs text-gray-500">{m.sales.toLocaleString()}</div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Tea Types */}
        <div className="bg-white shadow rounded p-4 h-full">
          <h5 className="text-center font-semibold mb-4">Top Selling Tea Types</h5>
          {teaTypes.map(t => (
            <div key={t.name} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold">{t.name}</span>
                <span className="text-xs text-gray-500">{t.value}%</span>
              </div>
              <div className="bg-gray-200 h-2 rounded">
                <div className="bg-green-700 h-2 rounded" style={{ width: `${t.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional and Yearly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Regional Sales */}
        <div className="bg-white shadow rounded p-4 h-full">
          <h5 className="text-center font-semibold mb-4">Sales by Region</h5>
          {(() => {
            const max = Math.max(...regionalSales.map(r => r.sales), 1);
            return regionalSales.map(r => (
              <div key={r.region} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">{r.region}</span>
                  <span className="text-xs text-gray-500">{r.sales.toLocaleString()}</span>
                </div>
                <div className="bg-gray-200 h-2 rounded">
                  <div className="h-2 rounded" style={{ width: `${Math.round((r.sales / max) * 100)}%`, backgroundColor: "#6c63ff" }} />
                </div>
              </div>
            ));
          })()}
        </div>

        {/* Yearly Trend */}
        <div className="bg-white shadow rounded p-4 h-full">
          <h5 className="text-center font-semibold mb-4">Yearly Trend</h5>
          {(() => {
            const max = Math.max(...yearlyTrend.map(y => y.sales), 1);
            return (
              <div className="flex items-end justify-around h-56 gap-3">
                {yearlyTrend.map(y => (
                  <div key={y.year} className="text-center w-14">
                    <div
                      className="bg-green-700 rounded"
                      style={{ height: Math.max(12, Math.round((y.sales / max) * 160)) }}
                      title={`${y.year}: ${y.sales.toLocaleString()}`}
                    />
                    <div className="text-sm font-semibold mt-2">{y.year}</div>
                    <div className="text-xs text-gray-500">{y.sales.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Trust elements */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-100 p-3 rounded text-center font-semibold">⭐ 1000+ Happy Customers</div>
            <div className="bg-gray-100 p-3 rounded text-center font-semibold">🏆 Certified Quality</div>
            <div className="bg-gray-100 p-3 rounded text-center font-semibold">📦 Premium Packaging</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center my-8">
        <h3 className="text-xl font-bold mb-2">Join thousands of tea lovers who choose us every day!</h3>
        <p className="text-gray-500 mb-4">Be part of our journey and enjoy authentic Ceylon Tea.</p>
        <Link
          to="/customer/accessories"
          className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800"
        >
          Order Now
        </Link>
      </div>
    </div>
  );
}
