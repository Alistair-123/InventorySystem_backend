import bcrypt from "bcrypt";
import Personnel from "../../models/Personnel/Personnel.js";

const saltRounds = 10;

/**
 * CREATE PERSONNEL
 */
export const createPersonnel = async (req, res) => {
  try {
    const {
      personnelId,
      firstName,
      middleName,
      lastName,
      personnelType,
      designationName,
      status,
      password,
      role,
    } = req.body;


    const existingPersonnel = await Personnel.findOne({ personnelId });
    if (existingPersonnel) {
      return res.status(400).json({ message: "Personnel ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newPersonnel = new Personnel({
      personnelId,
      firstName,
      middleName,
      lastName,
      personnelType,
      designationName,
      status,
      password: hashedPassword,
      role,
    });

    await newPersonnel.save();

    res.status(201).json({
      message: "Personnel created successfully",
      personnel: newPersonnel,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


export const getPersonnel = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {};

    if (search) {
      query.$or = [
        { personnelId: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { designationName: { $regex: search, $options: "i" } },
      ];
    }

    const [personnel, totalPersonnel] = await Promise.all([
      Personnel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select("-password"), 
      Personnel.countDocuments(query),
    ]);

    res.status(200).json({
      data: personnel,
      pagination: {
        totalItems: totalPersonnel,
        totalPages: Math.ceil(totalPersonnel / limit),
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


export const updatePersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(
        updateData.password,
        saltRounds
      );
    }

    const updatedPersonnel = await Personnel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedPersonnel) {
      return res.status(404).json({ message: "Personnel not found" });
    }

    res.status(200).json({
      message: "Personnel updated successfully",
      personnel: updatedPersonnel,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


export const deletePersonnel = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPersonnel = await Personnel.findByIdAndDelete(id);

    if (!deletedPersonnel) {
      return res.status(404).json({ message: "Personnel not found" });
    }

    res.status(200).json({
      message: "Personnel deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
