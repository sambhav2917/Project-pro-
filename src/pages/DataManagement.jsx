import React, { useState } from "react";
import MaterialTable from "../components/MaterialTable";
import WarehouseManagement from "../components/WarehouseManagement"; // Import warehouse component
import * as XLSX from "xlsx";
import { validateMaterial } from "../utils/materialValidation";

export default function DataManagement() {
  const [materials, setMaterials] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [errors, setErrors] = useState({});

  const emptyMaterial = {
    Product_ID: "",
    Product_Description: "",
    Cat: "",
    Sub_Cat: "",
    Old_Product_ID: "",
    Product_Type: "",
    Is_Plannable: "",
    ABC_Cat: "",
    NLV: "",
    Lead_Time: "",
    Min_Lot_Size: "",
    Max_Lot_Size: ""
  };

  // Add or Edit Material
  const saveMaterial = () => {
    const validationErrors = validateMaterial(modalData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setMaterials(prev => {
      const exists = prev.find(m => m.Product_ID === modalData.Product_ID);
      if (exists) {
        return prev.map(m =>
          m.Product_ID === modalData.Product_ID ? modalData : m
        );
      }
      return [...prev, modalData];
    });

    setModalData(null);
    setErrors({});
  };

  // Delete Material
  const deleteMaterial = id => {
    setMaterials(materials.filter(m => m.Product_ID !== id));
  };

  // Bulk Upload
  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const arrayBuffer = e.target.result;
      try {
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        let rows = XLSX.utils.sheet_to_json(sheet);

        const invalidRows = rows.filter(row => Object.keys(validateMaterial(row)).length > 0);
        if (invalidRows.length > 0) {
          alert("Some rows in Excel are invalid. Please correct them.");
          return;
        }

        const newData = [...materials, ...rows];
        const uniqueMaterials = newData.filter(
          (item, index, arr) =>
            index === arr.findIndex(t => t.Product_ID === item.Product_ID)
        );

        setMaterials(uniqueMaterials);
        alert(`${rows.length} materials added successfully!`);
      } catch (err) {
        console.error(err);
        alert("Invalid Excel file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-6">
      {/* ========== MATERIAL MANAGEMENT SECTION ========== */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Material Master</h1>

        {/* Material Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setModalData({ ...emptyMaterial });
              setErrors({});
            }}
          >
            ➕ Add Material
          </button>
          <button
            onClick={() => document.getElementById("bulkUploadInput").click()}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            📤 Bulk Upload
          </button>
          <input
            id="bulkUploadInput"
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={handleBulkUpload}
          />
        </div>

        {/* Material Table */}
        <MaterialTable
          materials={materials}
          onEdit={mat => {
            setModalData(mat);
            setErrors({});
          }}
          onDelete={deleteMaterial}
        />
      </div>

      {/* ========== WAREHOUSE MANAGEMENT SECTION (Separate Component) ========== */}
      <WarehouseManagement />

      {/* ========== MATERIAL MODAL ========== */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {materials.find(m => m.Product_ID === modalData.Product_ID)
                ? "Edit Material"
                : "Add Material"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {Object.keys(modalData).map(key => (
                <div key={key} className="flex flex-col">
                  <input
                    className="border p-2 rounded"
                    placeholder={key}
                    value={modalData[key]}
                    onChange={e =>
                      setModalData({ ...modalData, [key]: e.target.value })
                    }
                  />
                  {errors[key] && (
                    <span className="text-red-600 text-sm">{errors[key]}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-5">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setModalData(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={saveMaterial}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}