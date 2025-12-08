import React, { useState } from "react";
import MaterialManagement from "../components/MaterialManagement";
import WarehouseManagement from "../components/WarehouseManagement";
import BulkTagSKUs from "../components/BulkTagSKUs"; // Import the new component

export default function DataManagement() {
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState("materials"); // For tab switching

  return (
    <div className="p-6">
      {/* Tabs for Navigation */}
      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "materials"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("materials")}
        >
          📦 Material Management
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "warehouse"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("warehouse")}
        >
          🏭 Warehouse Management
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "bulk-tag"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("bulk-tag")}
        >
          🏷️ Bulk Tag SKUs
        </button>
      </div>

      {/* Conditional Rendering with Tabs */}
      {activeTab === "materials" && (
        <MaterialManagement
          materials={materials}
          setMaterials={setMaterials}
        />
      )}

      {activeTab === "warehouse" && (
        <WarehouseManagement />
      )}

      {activeTab === "bulk-tag" && (
        <BulkTagSKUs />
      )}
    </div>
  );
}