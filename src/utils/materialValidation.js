// materialValidation.js

export function validateMaterial(material) {
  const errors = {};

  if (!material.Product_ID || material.Product_ID.trim() === "")
    errors.Product_ID = "Product ID is required";

  if (!material.Product_Description || material.Product_Description.trim() === "")
    errors.Product_Description = "Product Description is required";

  if (!material.Cat || material.Cat.trim() === "")
    errors.Cat = "Category is required";

  if (!material.Sub_Cat || material.Sub_Cat.trim() === "")
    errors.Sub_Cat = "Sub Category is required";

  if (!material.Old_Product_ID || material.Old_Product_ID.trim() === "")
    errors.Old_Product_ID = "Old Product ID is required";

  if (!material.Product_Type || material.Product_Type.trim() === "")
    errors.Product_Type = "Product Type is required";

  if (!material.Is_Plannable || material.Is_Plannable.trim() === "")
    errors.Is_Plannable = "Is Plannable field is required";

  if (!material.ABC_Cat || material.ABC_Cat.trim() === "")
    errors.ABC_Cat = "ABC Category is required";

  if (!material.NLV || isNaN(material.NLV))
    errors.NLV = "NLV must be a number";

  if (!material.Lead_Time || isNaN(material.Lead_Time))
    errors.Lead_Time = "Lead Time must be a number";

  if (!material.Min_Lot_Size || isNaN(material.Min_Lot_Size))
    errors.Min_Lot_Size = "Min Lot Size must be a number";

  if (!material.Max_Lot_Size || isNaN(material.Max_Lot_Size))
    errors.Max_Lot_Size = "Max Lot Size must be a number";

  return errors;
}
