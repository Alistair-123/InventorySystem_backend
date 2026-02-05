import Property from "../../models/Property/Property.js";
import Items from "../../models/Item/Items.js";

/**
 * GET Properties Per Item
 * Route: GET /api/properties/item/:itemId
 * Purpose: Show all property units under one selected item
 */
export const getPropertiesPerItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // 1. Find the Item details first
    const item = await Items.findById(itemId)
      .populate("category", "name")
      .populate("brand", "name")
      .populate("unit", "name");

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // 2. Find all Properties that belong to this Item
    const properties = await Property.find({ item: itemId })
      .populate("acquisitionType", "name")
      .populate("personnel", "firstName lastName")
      .populate("office", "officeName")
      .sort({ createdAt: -1 });

    // 3. Return response for frontend rendering
    res.status(200).json({
      item,
      totalProperties: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties per item:", error);

    res.status(500).json({
      message: "Server error fetching properties per item",
      error: error.message,
    });
  }
};
