import Category from "../../models/Category/Categories.js";
import Brand from "../../models/Brand/Brand.js";
import Unit from "../../models/Unit/Unit.js";

export const getReferenceData = async (req, res) => {
  try {
    const [categories, brands, units] = await Promise.all([
      Category.find({ status: "active" })
        .select("_id categoryName")
        .sort({ categoryName: 1 }),

      Brand.find({ status: "active" })
        .select("_id brandName")
        .sort({ brandName: 1 }),

      Unit.find({ status: "active" })
        .select("_id unitName")
        .sort({ unitName: 1 })
    ]);

    res.status(200).json({
      categories,
      brands,
      units
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reference data",
      error: error.message
    });
  }
};