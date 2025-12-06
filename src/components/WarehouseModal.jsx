import React, { useState } from "react";

const WarehouseModal = ({ warehouse, onClose, onSave, saveWarehouse }) => {
  const [formData, setFormData] = useState({
    warehouse_name: warehouse.warehouse_name || "",
    sales_region: warehouse.sales_region || "",
    is_mother_warehouse: warehouse.is_mother_warehouse || false,
    id: warehouse.id || null,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.warehouse_name.trim()) {
      newErrors.warehouse_name = "Warehouse name is required";
    }
    
    if (!formData.sales_region.trim()) {
      newErrors.sales_region = "Sales region is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await saveWarehouse(formData);
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving warehouse:", error);
      alert("Failed to save warehouse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Add New Warehouse
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Warehouse Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse Name *
                </label>
                <input
                  type="text"
                  name="warehouse_name"
                  value={formData.warehouse_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.warehouse_name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter warehouse name"
                  disabled={loading}
                />
                {errors.warehouse_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.warehouse_name}</p>
                )}
              </div>

              {/* Sales Region */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Region *
                </label>
                <input
                  type="text"
                  name="sales_region"
                  value={formData.sales_region}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.sales_region ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter sales region"
                  disabled={loading}
                />
                {errors.sales_region && (
                  <p className="mt-1 text-sm text-red-600">{errors.sales_region}</p>
                )}
              </div>

              {/* Mother Warehouse Checkbox */}
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="is_mother_warehouse"
                  name="is_mother_warehouse"
                  checked={formData.is_mother_warehouse}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <label htmlFor="is_mother_warehouse" className="ml-2 text-sm text-gray-700">
                  This is a Mother Warehouse
                </label>
              </div>

              {/* Help text */}
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p className="font-medium mb-1">Warehouse Types:</p>
                <p>• <span className="font-medium">Mother Warehouse:</span> Central distribution hub</p>
                <p>• <span className="font-medium">Regional Warehouse:</span> Serves specific sales region</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : "Add Warehouse"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WarehouseModal;