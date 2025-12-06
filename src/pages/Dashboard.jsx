import { useState, useEffect } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8080/api/dashboard"); // replace with your API endpoint
        if (!res.ok) throw new Error("API response not ok");
        const result = await res.json();
        setStats(result);
      } catch (err) {
        console.error("Failed to fetch backend data, using dummy data:", err);
        // Dummy data fallback
        setStats({
          forecastAccuracy: 92.5,
          stockOnHand: "1.2M Units",
          pendingDistributions: 3,
          lowSkuCount: 12,
          recentActivity: [
            { action: "Forecast Generated", details: "For Sep 2024", time: "15 mins ago" },
            { action: "Print Plan Calculated", details: "5 new print lots created", time: "45 mins ago" },
            { action: "Data Uploaded", details: "Historical Sales Q2 2024.csv", time: "2 hours ago" },
            { action: "Distribution Plan Executed", details: "Plan #DP-0822", time: "5 hours ago" }
          ]
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-xl">Loading dashboard...</div>;

  return (
    <div className="p-6">
      {/* Top Greeting */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-gray-600">Here's a snapshot of your supply chain operations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Overall Forecast Accuracy</h3>
          <p className="text-3xl font-bold">{stats.forecastAccuracy}%</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Total Stock on Hand</h3>
          <p className="text-3xl font-bold">{stats.stockOnHand}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Pending Distributions</h3>
          <p className="text-3xl font-bold">{stats.pendingDistributions}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-sm text-gray-500">SKUs Below Safety Stock</h3>
          <p className="text-3xl font-bold">{stats.lowSkuCount}</p>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">New Forecast</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg">New Print Plan</button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">New Distribution</button>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left font-semibold border-b">
              <th className="py-2">Action</th>
              <th className="py-2">Details</th>
              <th className="py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentActivity.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">{item.action}</td>
                <td>{item.details}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}