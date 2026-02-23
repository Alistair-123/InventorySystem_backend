import Items from "../../models/Item/Items.js"
import Property from "../../models/Property/Property.js";
import Personnel from "../../models/Personnel/Personnel.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Run all queries in parallel
    const [
      totalItems,
      totalProperties,
      totalUsers,
      propertyAggregation,
      statusAggregation
    ] = await Promise.all([
      Items.countDocuments(),
      Property.countDocuments(),
      Personnel.countDocuments(),
      Property.aggregate([
        {
          $group: {
            _id: null,
            totalValue: { $sum: "$acquisitionValue" }
          }
        }
      ]),
      Property.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Extract total property value
    const totalPropertyValue =
      propertyAggregation.length > 0
        ? propertyAggregation[0].totalValue
        : 0;

    // Default status structure (ensures zero values)
    const statusBreakdown = {
      serviceable: 0,
      unserviceable: 0,
      disposed: 0,
      lost: 0
    };

    // Map aggregation results into default structure
    statusAggregation.forEach((status) => {
      statusBreakdown[status._id] = status.count;
    });

    return res.status(200).json({
      totalItems,
      totalProperties,
      totalUsers,
      totalPropertyValue, // raw number (frontend formats)
      propertyStatusBreakdown: statusBreakdown
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      message: "Failed to fetch dashboard statistics"
    });
  }
};