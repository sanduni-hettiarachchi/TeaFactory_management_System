// ReportsPage.jsx

import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function ReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/reports/delivery-stats"); // your API
      const data = await res.json();
      setReportData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-full bg-gray-50 py-8 text-center">
        <p className="text-gray-500">Unable to load report data.</p>
      </div>
    );
  }

  // Example: reportData might have structure { byStatus: {...}, byDriver: [...], monthlyDeliveries: [...] }
  const { byStatus, byDriver, monthlyDeliveries } = reportData;

  const statusLabels = Object.keys(byStatus);
  const statusValues = statusLabels.map(label => byStatus[label]);

  const driverLabels = byDriver.map(d => d.name);
  const driverValues = byDriver.map(d => d.count);

  const monthLabels = monthlyDeliveries.map(m => m.month);
  const monthValues = monthlyDeliveries.map(m => m.total);

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>

        {/* Delivery by Status Pie */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Deliveries by Status</h2>
          </div>
          <div className="p-6 h-64">
            <Pie
              data={{
                labels: statusLabels,
                datasets: [
                  {
                    label: "# of Deliveries",
                    data: statusValues,
                    backgroundColor: ["#FCD34D", "#60A5FA", "#34D399", "#F87171"],
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Deliveries per Driver */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Deliveries per Driver</h2>
          </div>
          <div className="p-6 h-64">
            <Bar
              data={{
                labels: driverLabels,
                datasets: [
                  {
                    label: "Deliveries",
                    data: driverValues,
                    backgroundColor: driverLabels.map(() => "#60A5FA"),
                  },
                ],
              }}
              options={{ scales: { y: { beginAtZero: true } } }}
            />
          </div>
        </div>

        {/* Monthly Deliveries */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Monthly Deliveries</h2>
          </div>
          <div className="p-6 h-64">
            <Bar
              data={{
                labels: monthLabels,
                datasets: [
                  {
                    label: "Deliveries per Month",
                    data: monthValues,
                    backgroundColor: monthLabels.map(() => "#34D399"),
                  },
                ],
              }}
              options={{ scales: { y: { beginAtZero: true } } }}
            />
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              // Implement export logic: maybe fetch csv/pdf from server or convert current data
              // For example:
              fetch("http://localhost:3001/api/reports/export", {
                method: "GET",
              })
                .then(res => res.blob())
                .then(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "delivery_report.csv";  // or .pdf
                  a.click();
                  window.URL.revokeObjectURL(url);
                })
                .catch(err => console.error("Error exporting:", err));
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Export Report
          </button>
        </div>

      </div>
    </div>
  );
}