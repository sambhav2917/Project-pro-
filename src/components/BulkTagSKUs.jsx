import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Save, 
  X, 
  Check, 
  AlertCircle,
  Info,
  Package,
  Warehouse,
  Tag
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const BulkTagSKUs = () => {
  // Demo data fallback for when API is not available
  const demoWarehouses = [
    { id: 'west', name: 'West Coast Warehouse', code: 'WEST', location: 'Los Angeles, CA' },
    { id: 'east', name: 'East Coast Distribution', code: 'EAST', location: 'New York, NY' },
    { id: 'central', name: 'Central Hub', code: 'CENTRAL', location: 'Chicago, IL' },
    { id: 'south', name: 'Southern Center', code: 'SOUTH', location: 'Atlanta, GA' }
  ];

  const demoSKUs = [
    { id: 1, sku: 'ELEC-001', name: 'Wireless Bluetooth Headphones', category: 'Electronics', brand: 'AudioTech', price: 129.99, stock: 150 },
    { id: 2, sku: 'APP-002', name: 'Premium Smartphone', category: 'Electronics', brand: 'TechCore', price: 899.99, stock: 85 },
    { id: 3, sku: 'CLO-003', name: 'Designer T-Shirt', category: 'Clothing', brand: 'UrbanStyle', price: 34.99, stock: 300 },
    { id: 4, sku: 'CLO-004', name: 'Denim Jeans', category: 'Clothing', brand: 'DenimCo', price: 79.99, stock: 120 },
    { id: 5, sku: 'HOM-005', name: 'Coffee Maker Pro', category: 'Home Goods', brand: 'BrewMaster', price: 129.99, stock: 75 },
    { id: 6, sku: 'TOY-006', name: 'Strategy Board Game', category: 'Toys & Games', brand: 'FamilyFun', price: 44.99, stock: 200 },
    { id: 7, sku: 'ELEC-007', name: 'Smart Watch Series 5', category: 'Electronics', brand: 'TechWear', price: 249.99, stock: 95 },
    { id: 8, sku: 'HOM-008', name: 'Air Purifier', category: 'Home Goods', brand: 'CleanAir', price: 199.99, stock: 60 },
    { id: 9, sku: 'CLO-009', name: 'Winter Jacket', category: 'Clothing', brand: 'OutdoorGear', price: 149.99, stock: 80 },
    { id: 10, sku: 'ELEC-010', name: 'Gaming Laptop', category: 'Electronics', brand: 'GameMaster', price: 1299.99, stock: 45 },
    { id: 11, sku: 'TOY-011', name: 'Educational Building Blocks', category: 'Toys & Games', brand: 'LearnPlay', price: 59.99, stock: 180 },
    { id: 12, sku: 'HOM-012', name: 'Kitchen Blender', category: 'Home Goods', brand: 'ChefPro', price: 89.99, stock: 110 }
  ];

  // State management
  const [skus, setSkus] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('');
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
        const processedSkus = skusResponse.data.map(sku => ({
          ...sku,
          warehouses: sku.warehouses || []
        }));
        
        setSkus(processedSkus);
        setWarehouses(warehousesResponse.data);
        setUseDemoData(false);
        
        // Set active tab to first warehouse if not set
        if (!activeTab && warehousesResponse.data.length > 0) {
          setActiveTab(warehousesResponse.data[0].id);
        }
        
        showNotification('Data loaded successfully!', 'success');
      }
    } catch (err) {
      console.log('API not available, using demo data:', err.message);
      setUseDemoData(true);
      const demoSkusWithWarehouses = demoSKUs.map(sku => ({ 
        ...sku, 
        warehouses: [] 
      }));
      setSkus(demoSkusWithWarehouses);
      setWarehouses(demoWarehouses);
      
      // Set active tab to first warehouse
      if (!activeTab && demoWarehouses.length > 0) {
        setActiveTab(demoWarehouses[0].id);
      }
      
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
      <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border ${bgColor} ${textColor} shadow-lg flex items-center gap-3`}>
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

  return (
    <div className="">
      {/* Header with minimal top margin */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Bulk Tag SKUs with Warehouses</h1>
        <div className="mt-1 text-sm text-gray-600">
          {skus.length} SKUs • {warehouses.length} Warehouses
        </div>
      </div>

      {renderNotification()}

      {/* Warehouse Tabs */}
      {warehouses.length > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Select Warehouse</h3>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {warehouses.map(warehouse => (
                <button
                  key={warehouse.id}
                  onClick={() => setActiveTab(warehouse.id)}
                  className={`px-4 py-2.5 rounded transition-colors ${
                    activeTab === warehouse.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-medium">{warehouse.code}</div>
                  <div className="text-xs opacity-80">{warehouse.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Card with Refresh button in header */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {/* Search and Controls with Refresh button */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search SKUs, names, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                disabled={isLoading || isSaving}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
              >
                Refresh Data
              </button>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={isAllSelected()}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  disabled={filteredSKUs.length === 0 || !activeTab}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="select-all" className="text-sm text-gray-700">
                  Select all for {getCurrentWarehouse().code || 'selected warehouse'}
                </label>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>
              Showing <span className="font-medium">{filteredSKUs.length}</span> of{' '}
              <span className="font-medium">{skus.length}</span> SKUs
            </span>
            {activeTab && (
              <span className="flex items-center gap-1">
                <Warehouse className="w-4 h-4" />
                Active Warehouse: {getCurrentWarehouse().name}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable SKU Table */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allow Sale
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredSKUs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No SKUs found matching your search' : 'No SKUs available'}
                  </td>
                </tr>
              ) : (
                filteredSKUs.map(sku => (
                  <tr key={sku.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                        {sku.sku}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sku.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {sku.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${sku.price?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sku.stock > 100 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sku.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeTab ? sku.warehouses.includes(activeTab) : false}
                          onChange={(e) => 
                            handleCheckboxChange(sku.id, activeTab, e.target.checked)
                          }
                          disabled={!activeTab}
                          className="sr-only"
                        />
                        <div className={`relative w-11 h-6 rounded-full transition-colors ${
                          activeTab && sku.warehouses.includes(activeTab) 
                            ? 'bg-blue-600' 
                            : 'bg-gray-300'
                        } ${!activeTab ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            activeTab && sku.warehouses.includes(activeTab) 
                              ? 'transform translate-x-5' 
                              : ''
                          }`}></div>
                        </div>
                        <span className={`ml-2 text-sm ${!activeTab ? 'text-gray-400' : 'text-gray-600'}`}>
                          {activeTab && sku.warehouses.includes(activeTab) ? 'Allowed' : 'Blocked'}
                        </span>
                      </label>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                disabled={isSaving || skus.length === 0}
                className="text-red-600 hover:text-red-900 hover:bg-red-50 px-4 py-2 rounded transition-colors disabled:opacity-50"
              >
                Reset All Selections
              </button>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving || skus.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
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
      {warehouses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Warehouse Assignment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {warehouses.map(warehouse => {
              const assignedCount = skus.filter(sku => sku.warehouses.includes(warehouse.id)).length;
              const percentage = skus.length > 0 ? Math.round((assignedCount / skus.length) * 100) : 0;
              
              return (
                <div key={warehouse.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{warehouse.code}</h4>
                      <p className="text-sm text-gray-500">{warehouse.name}</p>
                    </div>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      percentage > 50 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {percentage}%
                    </span>
                  </div>
                  
                  <div className="mb-3">
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
        </div>
      )}

      {/* Footer Note */}
      <div className="text-sm text-gray-500 text-center">
        <p>
          {useDemoData ? (
            <>To connect to your API, set the <code className="bg-gray-100 px-1 py-0.5 rounded">REACT_APP_API_URL</code> environment variable</>
          ) : (
            <>Connected to API at <code className="bg-gray-100 px-1 py-0.5 rounded">{API_BASE_URL}</code></>
          )}
        </p>
      </div>
    </div>
  );
};

export default BulkTagSKUs;