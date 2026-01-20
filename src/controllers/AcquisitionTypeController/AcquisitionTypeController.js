import AcquisitionType from "../../models/AcquisitionType/AcquisitionType.js";

/**
 * CREATE ACQUISITION TYPE
 */
export const createAcquisitionType = async (req, res) => {
  try {
    const { acquisitionTypeName, status } = req.body;

    const newAcquisitionType = new AcquisitionType({
      acquisitionTypeName,
      status
    });

    await newAcquisitionType.save();

    res.status(201).json({
      message: "Acquisition Type created successfully",
      acquisitionType: newAcquisitionType
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


/**
 * GET ACQUISITION TYPES (pagination + search)
 */
export const getAcquisitionTypes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {};

    if (search) {
      query.$or = [
        { acquisitionTypeId: { $regex: search, $options: "i" } },
        { acquisitionTypeName: { $regex: search, $options: "i" } },
      ];
    }

    const [types, totalTypes] = await Promise.all([
      AcquisitionType.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      AcquisitionType.countDocuments(query),
    ]);

    res.status(200).json({
      data: types,
      pagination: {
        totalItems: totalTypes,
        totalPages: Math.ceil(totalTypes / limit),
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
 * UPDATE ACQUISITION TYPE
 */
export const updateAcquisitionType = async (req, res) => {
  try {
    const { id } = req.params;
    const { acquisitionTypeName, status } = req.body;

    const updatedType = await AcquisitionType.findByIdAndUpdate(
      id,
      { acquisitionTypeName, status },
      { new: true, runValidators: true }
    );

    if (!updatedType) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({
      message: "Updated successfully",
      acquisitionType: updatedType
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


/**
 * DELETE ACQUISITION TYPE
 */
export const deleteAcquisitionType = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedType = await AcquisitionType.findByIdAndDelete(id);

    if (!deletedType) {
      return res.status(404).json({
        message: "Acquisition Type not found",
      });
    }

    res.status(200).json({
      message: "Acquisition Type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
