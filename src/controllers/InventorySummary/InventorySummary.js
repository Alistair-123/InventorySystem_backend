import Property from "../../models/Property/Property.js";
import calculateDepreciation from "../../utils/calculateDepreciation.js";

export const getPropertiesWithDepreciation = async (req, res) => {
  try {
    /* Query params */
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    /* Fetch properties */
    const properties = await Property.find()
      .populate("item", "itemName")
      .populate("acquisitionType", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    /* Search filtering */
    const filtered = properties.filter((prop) => {
      const itemName = prop.item?.name?.toLowerCase() || "";
      const propertyNo = prop.propertyNo?.toLowerCase() || "";

      return (
        itemName.includes(search.toLowerCase()) ||
        propertyNo.includes(search.toLowerCase())
      );
    });

    /* Depreciation mapping */
    const result = filtered.map((prop) => {
      const acquisitionValue = prop.acquisitionValue;
      const acquisitionDate = prop.acquisitionDate;

      const currentValue = calculateDepreciation(
        acquisitionValue,
        acquisitionDate
      );

      const depreciated = acquisitionValue - currentValue;

      const now = new Date();
      const purchase = new Date(acquisitionDate);

      const yearsPassed =
        (now - purchase) / (1000 * 60 * 60 * 24 * 365);

      const remainingLife = Math.max(5 - yearsPassed, 0);

      return {
        propertyNo: prop.propertyNo,
        itemName: prop.item?.itemName || null,
        acquisitionDate: prop.acquisitionDate,
        acquisitionName: prop.acquisitionType?.name || null,
        acquisitionValue,

        currentValue,
        depreciated: Math.round(depreciated),
        remainingLife: Math.ceil(remainingLife),
      };
    });

    const total = await Property.countDocuments();

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};