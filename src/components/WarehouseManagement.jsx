import React, { useState, useEffect } from "react";
import WarehouseModal from "./WarehouseModal";

// Mock initial data
const initialWarehouses = [
  { id: "1", warehouse_name: "Main Warehouse", sales_region: "North America", is_mother_warehouse: true },
  { id: "2", warehouse_name: "East Coast", sales_region: "North America", is_mother_warehouse: false },
  { id: "3", warehouse_name: "Europe Hub", sales_region: "Europe", is_mother_warehouse: true },
  { id: "4", warehouse_name: "Asia Pacific", sales_region: "Asia", is_mother_warehouse: false },
];

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseModalData, setWarehouseModalData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load warehouses on component mount
  useEffect(() => {
    loadWarehouses();
  }, []);

  // Simulate API call
  const loadWarehouses = () => {
    setLoading(true);
    setTimeout(() => {
      setWarehouses([...initialWarehouses]);
      setLoading(false);
    }, 500);
  };

  // Save warehouse (simulated API call)
  const saveWarehouse = (warehouseData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (warehouseData.id) {
          // Update existing
          setWarehouses(prev => 
            prev.map(w => w.id === warehouseData.id ? warehouseData : w)
          );
        } else {
          // Add new
          const newWarehouse = {
            ...warehouseData,
            id: Date.now().toString()
          };
          setWarehouses(prev => [...prev, newWarehouse]);
        }
        resolve();
      }, 500);
    });
  };

  // Delete warehouse (simulated API call)
  const deleteWarehouse = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setWarehouses(prev => prev.filter(w => w.id !== id));
        resolve();
      }, 500);
    });
  };

  // Handle add warehouse
  const handleAddWarehouse = () => {
    setWarehouseModalData({
      warehouse_name: "",
      sales_region: "",
      is_mother_warehouse: false,
    });
  };

  // Handle delete warehouse
  const handleDeleteWarehouse = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteWarehouse(id);
      alert("Warehouse deleted successfully!");
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      alert("Failed to delete warehouse");
    } finally {
      setLoading(false);
    }
  };

  // Handle warehouse saved
  const handleWarehouseSaved = async () => {
    setWarehouseModalData(null);
    alert("Warehouse saved successfully!");
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Warehouse Management</h1>

      {/* Add Warehouse Button */}
      <div className="mb-6">
        <button
          onClick={handleAddWarehouse}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <span>+</span> Add New Warehouse
        </button>
      </div>

      {/* Warehouses List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : warehouses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No warehouses found. Add your first warehouse!
                  </td>
                </tr>
              ) : (
                warehouses.map((warehouse) => (
                  <tr key={warehouse.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {warehouse.warehouse_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {warehouse.sales_region}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {warehouse.is_mother_warehouse ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Mother Warehouse
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Regional Warehouse
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteWarehouse(warehouse.id, warehouse.warehouse_name)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Modal */}
      {warehouseModalData && (
        <WarehouseModal
          warehouse={warehouseModalData}
          onClose={() => setWarehouseModalData(null)}
          onSave={handleWarehouseSaved}
          saveWarehouse={saveWarehouse}
        />
      )}
    </div>
  );
};

export default WarehouseManagement;