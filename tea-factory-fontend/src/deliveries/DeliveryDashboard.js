// DeliveryDashboard.jsx
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchDeliveries();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchDeliveries, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/deliveries");
      const data = await res.json();
      
      // Check for recently completed deliveries
      const recentlyDelivered = data.filter(d => {
        if (d.status === "Delivered" && d.updatedAt) {
          const deliveryTime = new Date(d.updatedAt);
          const now = new Date();
          const diffMinutes = (now - deliveryTime) / (1000 * 60);
          return diffMinutes < 5; // Delivered in last 5 minutes
        }
        return false;
      });
      
      if (recentlyDelivered.length > 0) {
        const lastDelivered = recentlyDelivered[recentlyDelivered.length - 1];
        setSuccessMessage(`🎉 Delivery to ${lastDelivered.customerName} completed successfully!`);
        setTimeout(() => setSuccessMessage(""), 10000);
      }
      
      setDeliveries(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setLoading(false);
    }
  };

  // Compute counts for status cards
  const statusCounts = deliveries.reduce(
    (acc, delivery) => {
      acc[delivery.status] = (acc[delivery.status] || 0) + 1;
      return acc;
    },
    { "Pending": 0, "Out for Delivery": 0, "Delivered": 0, "Cancelled": 0 }
  );

  // Pie chart data with updated colors
  const pieData = {
    labels: ["Pending", "Out for Delivery", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [
          statusCounts["Pending"],
          statusCounts["Out for Delivery"],
          statusCounts["Delivered"],
          statusCounts["Cancelled"],
        ],
        backgroundColor: ["#FCD34D", "#60A5FA", "#34D399", "#F87171"],
        hoverBackgroundColor: ["#FBBF24", "#3B82F6", "#10B981", "#EF4444"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 'medium'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-7 h-7 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Delivery Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Overview of all delivery operations and statistics</p>
            </div>
            
            <div className="text-sm text-gray-500">
              <span className="font-medium">Total Deliveries: </span>
              <span className="text-green-600 font-semibold">{deliveries.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Success Message Alert */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage("")}
                className="ml-auto flex-shrink-0 text-green-500 hover:text-green-700 transition"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Status Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Delivery Status Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard 
              title="Pending" 
              count={statusCounts["Pending"]} 
              color="yellow"
              icon="clock"
            />
            <StatusCard 
              title="Out for Delivery" 
              count={statusCounts["Out for Delivery"]} 
              color="blue"
              icon="truck"
            />
            <StatusCard 
              title="Delivered" 
              count={statusCounts["Delivered"]} 
              color="green"
              icon="check"
            />
            <StatusCard 
              title="Cancelled" 
              count={statusCounts["Cancelled"]} 
              color="red"
              icon="x"
            />
          </div>
        </div>

        {/* Dashboard Charts and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Delivery Status Distribution
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : deliveries.length > 0 ? (
                <div className="h-64">
                  <Pie data={pieData} options={chartOptions} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-sm">No data available for chart</p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Recent Deliveries ({deliveries.length})
              </h2>
            </div>
            <div className="overflow-x-auto max-h-80">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-3 text-gray-600">Loading deliveries...</span>
                </div>
              ) : deliveries.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deliveries.slice(0, 10).map((delivery, index) => (
                      <tr key={delivery._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {delivery.customerName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {delivery.contactNumber}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {delivery.product}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {delivery.orderQuantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={delivery.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center p-12">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
                  <p className="text-gray-500 text-center">Start by creating your first delivery to see data here.</p>
                </div>
              )}
            </div>
            {deliveries.length > 10 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Showing 10 of {deliveries.length} deliveries
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Summary */}
        {deliveries.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Quick Statistics
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {((statusCounts["Delivered"] / deliveries.length) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {statusCounts["Out for Delivery"]}
                  </div>
                  <div className="text-sm text-gray-600">In Transit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {statusCounts["Pending"]}
                  </div>
                  <div className="text-sm text-gray-600">Awaiting</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {statusCounts["Cancelled"]}
                  </div>
                  <div className="text-sm text-gray-600">Cancelled</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Status Card Component
function StatusCard({ title, count, color, icon }) {
  const colors = {
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
      iconBg: "bg-yellow-100",
      iconText: "text-yellow-600"
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600"
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconText: "text-green-600"
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconText: "text-red-600"
    },
  };

  const icons = {
    clock: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    truck: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    check: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    x: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div className={`${colors[color].bg} ${colors[color].border} border rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center">
        <div className={`${colors[color].iconBg} ${colors[color].iconText} p-3 rounded-full`}>
          {icons[icon]}
        </div>
        <div className="ml-4">
          <h3 className={`text-sm font-medium ${colors[color].text} opacity-75`}>{title}</h3>
          <p className={`text-3xl font-bold ${colors[color].text} mt-1`}>{count}</p>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const getStatusStyle = (status) => {
    const styles = {
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Out for Delivery": "bg-blue-100 text-blue-800 border-blue-200",
      "Delivered": "bg-green-100 text-green-800 border-green-200",
      "Cancelled": "bg-red-100 text-red-800 border-red-200",
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
}