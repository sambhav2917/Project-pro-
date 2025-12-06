import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesHistory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchSKU, setSearchSKU] = useState("");
  const [skuGraph, setSkuGraph] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8080/api/sales-history"); // replace with your API endpoint
        if (!res.ok) throw new Error("API response not ok");
        const result = await res.json();
        setData(result);
        setSkuGraph(result.sales); // initial graph
      } catch (err) {
        console.error("Failed to fetch backend data, using dummy data:", err);
        const dummyData = {
          totalSales30d: "1.2M Units",
          monthOverMonth: "+5.2%",
          topSKU: "BK-001",
          topSKUChange: "+12%",
          topRegion: "North",
          topRegionPercent: "35%",
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          sales: [120, 150, 170, 130, 180, 200],
          skuSales: {
            "BK-001": [40, 50, 60, 45, 65, 70],
            "BK-002": [30, 35, 40, 28, 38, 45],
          },
          regionalPerformance: [
            { region: "North", sales: 350 },
            { region: "South", sales: 270 },
            { region: "East", sales: 180 },
            { region: "West", sales: 200 },
          ],
        };

        setData(dummyData);
        setSkuGraph(dummyData.sales);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSearch = () => {
    if (data.skuSales && data.skuSales[searchSKU]) {
      setSkuGraph(data.skuSales[searchSKU]);
    } else {
      alert("SKU not found");
    }
  };

  if (loading)
    return <div className="p-6 text-xl">Loading sales history...</div>;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Sales",
        data: skuGraph,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Sales History" },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Sales History</h1>
      <div className="mb-4 p-4 bg-white rounded-xl shadow flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h2 className="font-semibold">Total Sales (30d)</h2>
          <p className="text-xl font-bold">
            {data.totalSales30d}{" "}
            <span className="text-green-600 ml-2">
              {data.monthOverMonth} vs last month
            </span>
          </p>
        </div>
        <div>
          <h2 className="font-semibold">MoM Growth</h2>
          <p className="text-xl font-bold text-green-600">
            {data.monthOverMonth}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Top SKU</h2>
          <p className="text-xl font-bold">
            {data.topSKU}{" "}
            <span className="text-green-600 ml-2">
              {data.topSKUChange} vs avg last month
            </span>
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Top Region</h2>
          <p className="text-xl font-bold">
            {data.topRegion}{" "}
            <span className="text-green-600 ml-2">
              {data.topRegionPercent} of total vs last month
            </span>
          </p>
        </div>
      </div>

      {/* SKU Search */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search SKU"
          value={searchSKU}
          onChange={(e) => setSearchSKU(e.target.value)}
          className="p-2 border rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <Line data={chartData} options={options} />
      </div>

      {/* Top Performing SKUs */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Top Performing SKUs</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left font-semibold border-b">
              <th className="py-2">SKU</th>
              <th className="py-2">Units Sold</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data.skuSales || {}).map((sku, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{sku}</td>
                <td className="py-2">
                  {data.skuSales[sku].reduce((a, b) => a + b, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Regional Performance */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Regional Performance</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left font-semibold border-b">
              <th className="py-2">Region</th>
              <th className="py-2">Sales</th>
            </tr>
          </thead>
          <tbody>
            {data.regionalPerformance.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.region}</td>
                <td className="py-2">{item.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
