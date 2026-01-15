import Unit from "../../models/Unit/Unit.js";

/**
 * CREATE UNIT
 */
export const createUnit = async (req, res) => {
  try {
    const { unitId, unitName, status } = req.body;

    // Check if unitId already exists
    const existingUnit = await Unit.findOne({ unitId });
    if (existingUnit) {
      return res.status(400).json({ message: "Unit ID already exists" });
    }

    const newUnit = new Unit({
      unitId,
      unitName,
      status,
    });

    await newUnit.save();

    res.status(201).json({
      message: "Unit created successfully",
      unit: newUnit,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * GET UNITS (with pagination + search)
 */
export const getUnits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {};

    if (search) {
      query.$or = [
        { unitId: { $regex: search, $options: "i" } },
        { UnitName: { $regex: search, $options: "i" } },
      ];
    }

    const [units, totalUnits] = await Promise.all([
      Unit.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Unit.countDocuments(query),
    ]);

    res.status(200).json({
      data: units,
      pagination: {
        totalItems: totalUnits,
        totalPages: Math.ceil(totalUnits / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * UPDATE UNIT
 */
export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { unitId, unitName, status } = req.body;

    const updatedUnit = await Unit.findByIdAndUpdate(
      id,
      { unitId, unitName, status },
      { new: true, runValidators: true }
    );

    if (!updatedUnit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json({
      message: "Unit updated successfully",
      unit: updatedUnit,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * DELETE UNIT
 */
export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUnit = await Unit.findByIdAndDelete(id);

    if (!deletedUnit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json({
      message: "Unit deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
