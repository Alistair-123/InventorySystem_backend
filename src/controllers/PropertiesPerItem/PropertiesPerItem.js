import Property from "../../models/Property/Property.js";
import Items from "../../models/Item/Items.js";

/**
 * GET Properties Per Item (with Search + Pagination)
 * Route: GET /api/propertyitem/item/:itemId
 *
 * Query Params:
 *   ?search=PROP-001
 *   ?page=1
 *   ?limit=10
 */
export const getPropertiesPerItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Query params
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

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

    // 2. Build filter (Search by propertyNo or status)
    const filter = {
      item: itemId,
      ...(search && {
        $or: [
          { propertyNo: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
        ],
      }),
    };

    // 3. Count total matching properties
    const totalProperties = await Property.countDocuments(filter);

    // 4. Fetch paginated properties
    const properties = await Property.find(filter)
      .populate("acquisitionType", "name")
      .populate("personnel", "firstName lastName")
      .populate("office", "officeName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 5. Pagination calculations
    const totalPages = Math.ceil(totalProperties / limit);

    // 6. Response
    res.status(200).json({
      item,

      properties,

      pagination: {
        totalProperties,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching properties per item:", error);

    res.status(500).json({
      message: "Server error fetching properties per item",
      error: error.message,
    });
  }
};


export const getItemsWithPropertyTotals = async (req, res) => {
  try {
    // Query params
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Match filter for itemName or itemId
    const matchStage = search
      ? {
          $match: {
            $or: [
              { itemName: { $regex: search, $options: "i" } },
              { itemId: { $regex: search, $options: "i" } },
            ],
          },
        }
      : null;

    // Build pipeline
    const pipeline = [];

    if (matchStage) pipeline.push(matchStage);

    pipeline.push(
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "item",
          as: "properties",
        },
      },
      {
        $addFields: {
          totalProperties: { $size: "$properties" },
        },
      },
      {
        $project: {
          itemImage: 1,
          itemId: 1,
          itemName: 1,
          itemDescription: 1,
          totalProperties: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Total count (for pagination)
    const totalItems = await Items.countDocuments(
      search
        ? {
            $or: [
              { itemName: { $regex: search, $options: "i" } },
              { itemId: { $regex: search, $options: "i" } },
            ],
          }
        : {}
    );

    const totalPages = Math.ceil(totalItems / limit);

    // Execute aggregation
    const results = await Items.aggregate(pipeline);

    res.status(200).json({
      items: results,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching items with totals:", error);

    res.status(500).json({
      message: "Server error fetching item property totals",
      error: error.message,
    });
  }
};
