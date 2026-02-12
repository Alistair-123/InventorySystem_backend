import Property from "../../models/Property/Property.js";

/**
 * GET ALL PROPERTIES
 * Supports:
 * - Pagination (?page=1&limit=10)
 * - Search (?search=laptop)
 * - Filter by status (?status=serviceable)
 */
export const getProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Build query object
    let query = {};

    /* ✅ Search by propertyNo */
    if (search) {
      query.propertyNo = { $regex: search, $options: "i" };
    }

    /* ✅ Filter by enum status */
    if (status) {
      query.status = status;
    }

    // Total count (for pagination info)
    const total = await Property.countDocuments(query);

    // Fetch properties with pagination
    const properties = await Property.find(query)
      .populate("item", "name") // show item name only
      .populate("acquisitionType", "type")
      .populate("personnel", "name")
      .populate("office", "name")
      .sort({ createdAt: -1 }) // newest first
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};
