// ----- Demo Data -----

const demoRegions = [
  { regionId: 1, regionName: "North" },
  { regionId: 2, regionName: "South" },
  { regionId: 3, regionName: "East" },
  { regionId: 4, regionName: "West" },
  { regionId: 5, regionName: "Central" }
];

const demoWarehouses = [
  {
    warehouseId: 1,
    warehouseName: "North Hub",
    region: "North",
    isMotherWarehouse: true
  },
  {
    warehouseId: 2,
    warehouseName: "South Storehouse",
    region: "South",
    isMotherWarehouse: false
  },
  {
    warehouseId: 3,
    warehouseName: "East Distribution Center",
    region: "East",
    isMotherWarehouse: false
  },
  {
    warehouseId: 4,
    warehouseName: "West Retail Warehouse",
    region: "West",
    isMotherWarehouse: false
  },
  {
    warehouseId: 5,
    warehouseName: "Central Master Warehouse",
    region: "Central",
    isMotherWarehouse: true
  }
];

const demoSkus = [
  {
    sku: "SKU-1001",
    name: "Bluetooth Speaker",
    category: "Electronics",
    warehouses: {
      North: true,
      South: false,
      East: true,
      West: false,
      Central: true
    }
  },
  {
    sku: "SKU-1002",
    name: "Cotton T-shirt",
    category: "Apparel",
    warehouses: {
      North: false,
      South: true,
      East: false,
      West: true,
      Central: false
    }
  },
  {
    sku: "SKU-1003",
    name: "Organic Honey",
    category: "Grocery",
    warehouses: {
      North: true,
      South: true,
      East: false,
      West: false,
      Central: true
    }
  },
  {
    sku: "SKU-1004",
    name: "Power Bank 20,000mAh",
    category: "Electronics",
    warehouses: {
      North: false,
      South: false,
      East: true,
      West: true,
      Central: true
    }
  },
  {
    sku: "SKU-1005",
    name: "Running Shoes",
    category: "Footwear",
    warehouses: {
      North: true,
      South: false,
      East: false,
      West: true,
      Central: false
    }
  }
];

// ---------------------------------------------------
//  AI MOCK FUNCTIONSP
// ---------------------------------------------------

export async function fetchRegions() {
  return Promise.resolve(demoRegions);
}

export async function fetchWarehouses() {
  return Promise.resolve(demoWarehouses);
}

export async function createWarehouse(warehouseData) {
  const newWarehouse = {
    warehouseId: demoWarehouses.length + 1,
    ...warehouseData
  };

  demoWarehouses.push(newWarehouse);

  return Promise.resolve({
    message: "Warehouse created successfully",
    data: newWarehouse
  });
}

export async function fetchSkuWarehouseMapping() {
  return Promise.resolve(demoSkus);
}

export async function updateSkuWarehouseMapping(updatedList) {
  // In real backend → PUT /bulk/sku-warehouse
  return Promise.resolve({
    message: "SKU warehouse mapping saved successfully",
    updated: updatedList
  });
}
