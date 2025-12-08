import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Save, 
  RefreshCw, 
  X, 
  Check, 
  AlertCircle,
  Info,
  Package,
  Warehouse,
  Tag,
  Filter
} from 'lucide-react';

const API_BASE_URL =  'http://localhost:5000/api';

const BulkTagSKUs = () => {
  // Demo data fallback
  const demoWarehouses = [
    { id: 'west', name: 'West Warehouse', code: 'West', location: 'Los Angeles, CA' },
    { id: 'south', name: 'South Warehouse', code: 'South', location: 'Houston, TX' },
    { id: 'east', name: 'East Warehouse', code: 'East', location: 'New York, NY' },
    { id: 'north', name: 'Central Warehouse', code: 'North', location: 'Chicago, IL' }
  ];

  const demoSKUs = [
    { id: 1, sku: 'SKU001', name: 'Wireless Headphones', category: 'Electronics', brand: 'AudioTech', price: 129.99, stock: 150 },
    { id: 2, sku: 'SKU002', name: 'Cotton T-Shirt', category: 'Clothing', brand: 'BasicWear', price: 24.99, stock: 300 },
    { id: 3, sku: 'SKU003', name: 'Coffee Maker', category: 'Home Goods', brand: 'BrewMaster', price: 89.99, stock: 75 },
    { id: 4, sku: 'SKU004', name: 'Smart Watch', category: 'Electronics', brand: 'TechWear', price: 249.99, stock: 200 },
    { id: 5, sku: 'SKU005', name: 'Jeans', category: 'Clothing', brand: 'DenimCo', price: 59.99, stock: 180 },
    { id: 6, sku: 'SKU006', name: 'Board Game', category: 'Toys', brand: 'FamilyFun', price: 34.99, stock: 120 },
  ];

  // State management
  const [skus, setSkus] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('west');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useDemoData, setUseDemoData] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch data from API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Try to fetch SKUs from API
      const skusResponse = await axios.get(`${API_BASE_URL}/skus`, {
        timeout: 5000
      });
      
      // Try to fetch warehouses from API
      const warehousesResponse = await axios.get(`${API_BASE_URL}/warehouses`, {
        timeout: 5000
      });

      if (skusResponse.data && warehousesResponse.data) {
        setSkus(skusResponse.data.map(sku => ({
          ...sku,
          warehouses: sku.warehouses || []
        })));
        setWarehouses(warehousesResponse.data);
        setUseDemoData(false);
        showNotification('Data loaded successfully!', 'success');
      }
    } catch (err) {
      console.log('API not available, using demo data:', err.message);
      setUseDemoData(true);
      setSkus(demoSKUs.map(sku => ({ ...sku, warehouses: [] })));
      setWarehouses(demoWarehouses);
      setActiveTab(demoWarehouses[0]?.id || 'west');
      showNotification('Using demo data. Connect to API for real data.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Filter SKUs based on search term
  const filteredSKUs = skus.filter(sku =>
    sku.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle individual checkbox change
  const handleCheckboxChange = (skuId, warehouseId, checked) => {
    setSkus(prevSkus =>
      prevSkus.map(sku => {
        if (sku.id === skuId) {
          const updatedWarehouses = checked
            ? [...sku.warehouses, warehouseId]
            : sku.warehouses.filter(w => w !== warehouseId);
          return { ...sku, warehouses: updatedWarehouses };
        }
        return sku;
      })
    );
  };

  // Handle "Select All" for current warehouse tab
  const handleSelectAll = (checked) => {
    const warehouseId = activeTab;
    
    setSkus(prevSkus =>
      prevSkus.map(sku => {
        const updatedWarehouses = checked
          ? [...new Set([...sku.warehouses, warehouseId])]
          : sku.warehouses.filter(w => w !== warehouseId);
        return { ...sku, warehouses: updatedWarehouses };
      })
    );
  };

  // Check if all SKUs are selected for current warehouse
  const isAllSelected = () => {
    return filteredSKUs.length > 0 && filteredSKUs.every(sku => 
      sku.warehouses.includes(activeTab)
    );
  };

  // Handle save action
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      if (useDemoData) {
        // Simulate API call with demo data
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Demo: Saving warehouse assignments:', skus);
        showNotification('Demo: Assignments saved locally!', 'success');
      } else {
        // Real API call
        await axios.post(`${API_BASE_URL}/skus/bulk-assign-warehouses`, {
          assignments: skus.map(sku => ({
            skuId: sku.id,
            warehouses: sku.warehouses
          }))
        });
        showNotification('Warehouse assignments saved successfully!', 'success');
      }
    } catch (err) {
      console.error('Error saving assignments:', err);
      showNotification('Failed to save assignments. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset all selections
  const handleReset = () => {
    setSkus(prevSkus => 
      prevSkus.map(sku => ({ ...sku, warehouses: [] }))
    );
    showNotification('All selections cleared!', 'info');
  };

  // Get current warehouse name
  const getCurrentWarehouse = () => {
    return warehouses.find(w => w.id === activeTab) || {};
  };

  // Render notification
  const renderNotification = () => {
    if (!notification.show) return null;

    const bgColor = {
      success: 'bg-green-50 border-green-200',
      error: 'bg-red-50 border-red-200',
      info: 'bg-blue-50 border-blue-200'
    }[notification.type];

    const textColor = {
      success: 'text-green-800',
      error: 'text-red-800',
      info: 'text-blue-800'
    }[notification.type];

    const Icon = {
      success: Check,
      error: AlertCircle,
      info: Info
    }[notification.type];

    return (
      <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border ${bgColor} ${textColor} shadow-lg flex items-center gap-3 animate-slide-in`}>
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{notification.message}</span>
        <button 
          onClick={() => setNotification({ show: false, message: '', type: '' })}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Add this to your global CSS or in a style tag
  const style = `
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `;

  return (
    <>
      <style>{style}</style>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Bulk Tag SKUs with Warehouses
            </h1>
          </div>
          <p className="text-gray-600 mb-2">
            Assign sellable warehouses to multiple SKUs at once
          </p>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${useDemoData ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
              {useDemoData ? 'Demo Mode' : 'Live Data'}
            </span>
            <span className="text-sm text-gray-500">
              {skus.length} SKUs • {warehouses.length} Warehouses
            </span>
          </div>
        </div>

        {renderNotification()}

        {/* Warehouse Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {warehouses.map(warehouse => (
              <button
                key={warehouse.id}
                onClick={() => setActiveTab(warehouse.id)}
                className={`px-4 py-3 rounded-lg transition-all duration-200 flex-1 min-w-[180px] ${
                  activeTab === warehouse.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{warehouse.code}</div>
                  <div className="text-sm opacity-90">{warehouse.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Search and Controls */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search SKUs, names, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchData}
                  disabled={isLoading || isSaving}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={isAllSelected()}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={filteredSKUs.length === 0}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="select-all" className="text-sm text-gray-700">
                    Select all for {getCurrentWarehouse().code}
                  </label>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
              <span>
                Showing <span className="font-semibold">{filteredSKUs.length}</span> of{' '}
                <span className="font-semibold">{skus.length}</span> SKUs
              </span>
              <span className="flex items-center gap-1">
                <Warehouse className="w-4 h-4" />
                Active: {getCurrentWarehouse().name}
              </span>
            </div>
          </div>

          {/* SKU Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500">Loading SKU data...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">SKU</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Allow Sale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSKUs.length > 0 ? (
                    filteredSKUs.map(sku => (
                      <tr key={sku.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
                            {sku.sku}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{sku.name}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {sku.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          ${sku.price?.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            sku.stock > 100 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sku.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sku.warehouses.includes(activeTab)}
                              onChange={(e) => 
                                handleCheckboxChange(sku.id, activeTab, e.target.checked)
                              }
                              className="sr-only"
                            />
                            <div className={`relative w-11 h-6 rounded-full transition-colors ${
                              sku.warehouses.includes(activeTab) 
                                ? 'bg-blue-600' 
                                : 'bg-gray-300'
                            }`}>
                              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                sku.warehouses.includes(activeTab) 
                                  ? 'transform translate-x-5' 
                                  : ''
                              }`}></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {sku.warehouses.includes(activeTab) ? 'Allowed' : 'Blocked'}
                            </span>
                          </label>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No SKUs found matching your search</p>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm('')}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Clear search
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  disabled={isSaving || skus.length === 0}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Reset All
                </button>
                {useDemoData && (
                  <span className="text-sm text-gray-500">
                    Changes are saved locally in demo mode
                  </span>
                )}
              </div>
              
              <button
                onClick={handleSave}
                disabled={isSaving || skus.length === 0}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Warehouse Assignments
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {warehouses.map(warehouse => {
            const assignedCount = skus.filter(sku => sku.warehouses.includes(warehouse.id)).length;
            const percentage = skus.length > 0 ? Math.round((assignedCount / skus.length) * 100) : 0;
            
            return (
              <div key={warehouse.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{warehouse.code}</h3>
                    <p className="text-sm text-gray-500">{warehouse.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    percentage > 50 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {percentage}%
                  </span>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Assigned SKUs</span>
                    <span className="font-medium">{assignedCount}/{skus.length}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage > 50 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  {warehouse.location}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {useDemoData ? (
              <>To connect to your API, set the <code className="bg-gray-100 px-1 py-0.5 rounded">REACT_APP_API_URL</code> environment variable</>
            ) : (
              <>Connected to API at <code className="bg-gray-100 px-1 py-0.5 rounded">{API_BASE_URL}</code></>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default BulkTagSKUs;