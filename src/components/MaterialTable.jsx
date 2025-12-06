import React from "react";

export default function MaterialTable({ materials = [], onEdit, onDelete }) {
  if (!materials || materials.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600 border">
        No materials available
      </div>
    );
  }

  const headers = Object.keys(materials[0]);

  return (
    <div className="w-full overflow-x-auto border rounded">
      <table className="min-w-max w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((head) => (
              <th
                key={head}
                className="border p-2 whitespace-nowrap text-sm md:text-base"
              >
                {head}
              </th>
            ))}
            <th className="border p-2 whitespace-nowrap text-sm md:text-base">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {materials.map((m) => (
            <tr key={m.Product_ID} className="hover:bg-gray-50">
              {headers.map((col, i) => (
                <td
                  key={i}
                  className="border p-2 whitespace-nowrap text-sm md:text-base"
                >
                  {m[col]}
                </td>
              ))}

              <td className="border p-2 whitespace-nowrap flex gap-2 md:gap-3">
                <button
                  className="px-2 py-1 md:px-3 md:py-1 bg-yellow-500 text-white rounded text-xs md:text-sm"
                  onClick={() => onEdit(m)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 md:px-3 md:py-1 bg-red-600 text-white rounded text-xs md:text-sm"
                  onClick={() => onDelete(m.Product_ID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
