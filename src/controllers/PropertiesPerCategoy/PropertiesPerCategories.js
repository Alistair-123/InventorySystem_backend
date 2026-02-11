import Property from "../../models/Property/Property.js";
import Item from "../../models/Item/Items.js";
/* =========================================================
   ✅ 1. CATEGORY SUMMARY REPORT
   GET /api/reports/properties-per-category
   ========================================================= */
export const getPropertiesPerCategory = async (req, res) => {
  try {
    const { search } = req.query;

    const matchStage = {};

    // Optional search by category name
    if (search) {
      matchStage["categoryData.categoryName"] = {
        $regex: search,
        $options: "i"
      };
    }

    const report = await Property.aggregate([
      // Join Items
      {
        $lookup: {
          from: "items",
          localField: "item",
          foreignField: "_id",
          as: "itemData"
        }
      },
      { $unwind: "$itemData" },

      // Join Categories
      {
        $lookup: {
          from: "categories",
          localField: "itemData.category",
          foreignField: "_id",
          as: "categoryData"
        }
      },
      { $unwind: "$categoryData" },

      // Apply search filter
      { $match: matchStage },

      // Group by Category Name
      {
  $group: {
    _id: "$categoryData._id",
    categoryName: { $first: "$categoryData.categoryName" },

    total: { $sum: 1 },

    serviceable: {
      $sum: { $cond: [{ $eq: ["$status", "serviceable"] }, 1, 0] }
    },
    unserviceable: {
      $sum: { $cond: [{ $eq: ["$status", "unserviceable"] }, 1, 0] }
    },
    disposed: {
      $sum: { $cond: [{ $eq: ["$status", "disposed"] }, 1, 0] }
    },
    lost: {
      $sum: { $cond: [{ $eq: ["$status", "lost"] }, 1, 0] }
    }
  }
},


      // Format output
        {
  $project: {
    _id: 0,
    categoryId: "$_id",
    categoryName: 1,
    total: 1,
    serviceable: 1,
    unserviceable: 1,
    disposed: 1,
    lost: 1
  }
},

      // Sort highest first
      { $sort: { total: -1 } }
    ]);

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch properties per category",
      error: error.message
    });
  }
};

/* =========================================================
   ✅ 2. DRILL DOWN PROPERTIES BY CATEGORY
   GET /api/reports/category/:categoryId/properties
   ========================================================= */
export const getCategoryProperties = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const search = req.query.search || "";
    const status = req.query.status || "";

    const skip = (page - 1) * limit;

    // ✅ Find all items in this category
    const items = await Item.find({ category: categoryId }).select("_id");
    const itemIds = items.map((i) => i._id);

    // ✅ Build correct filter
    let filter = {
      item: { $in: itemIds }
    };

    if (status) filter.status = status;

    if (search) {
      filter.propertyNo = { $regex: search, $options: "i" };
    }

    // ✅ Query only properties in this category
    const properties = await Property.find(filter)
      .populate({
        path: "item",
        populate: {
          path: "category",
          select: "categoryName"
        }
      })
      .populate("office", "officeName")
      .populate("personnel", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // ✅ Correct pagination count
    const totalCount = await Property.countDocuments(filter);

    res.status(200).json({
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch category properties",
      error: error.message
    });
  }
};
