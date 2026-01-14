import Office from "../../models/Office/Office.js";

/**
 * CREATE OFFICE
 */
export const createOffice = async (req, res) => {
  try {
    const { officeId, officeName, status } = req.body;

    // Check if officeId already exists
    const existingOffice = await Office.findOne({ officeId });
    if (existingOffice) {
      return res.status(400).json({ message: "Office ID already exists" });
    }

    const newOffice = new Office({
      officeId,
      officeName,
      status,
    });

    await newOffice.save();

    res.status(201).json({
      message: "Office created successfully",
      office: newOffice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * GET OFFICES (pagination + search)
 */
export const getOffices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {};

    if (search) {
      query.$or = [
        { officeId: { $regex: search, $options: "i" } },
        { officeName: { $regex: search, $options: "i" } },
      ];
    }

    const [offices, totalOffices] = await Promise.all([
      Office.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Office.countDocuments(query),
    ]);

    res.status(200).json({
      data: offices,
      pagination: {
        totalItems: totalOffices,
        totalPages: Math.ceil(totalOffices / limit),
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
 * UPDATE OFFICE
 */
export const updateOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const { officeId, officeName, status } = req.body;

    const updatedOffice = await Office.findByIdAndUpdate(
      id,
      { officeId, officeName, status },
      { new: true, runValidators: true }
    );

    if (!updatedOffice) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.status(200).json({
      message: "Office updated successfully",
      office: updatedOffice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * DELETE OFFICE
 */
export const deleteOffice = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOffice = await Office.findByIdAndDelete(id);

    if (!deletedOffice) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.status(200).json({
      message: "Office deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
