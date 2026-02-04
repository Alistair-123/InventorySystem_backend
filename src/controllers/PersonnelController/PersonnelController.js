import bcrypt from "bcrypt";
import Personnel from "../../models/Personnel/Personnel.js";
import { deleteFileIfExists } from "../../utils/deleteFile.js";
const saltRounds = 10;

/**
 * CREATE PERSONNEL
 */
export const createPersonnel = async (req, res) => {
  try {
    let {
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

    if (!password || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // Normalize once
    personnelId = personnelId.trim().toUpperCase();

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
      role: role || "user",
      personnelImage: req.file
        ? `/uploads/personnels/${req.file.filename}`
        : null,
    });

    await newPersonnel.save();
    console.log("CREATE HIT", req.body.personnelId, Date.now());


    return res.status(201).json(newPersonnel);
  } catch (error) {
    // 🔐 Handle duplicate cleanly
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Personnel ID already exists",
      });
    }
    console.error("❌ CATCH HIT:", error);

    console.error("CREATE PERSONNEL ERROR:", error);
    return res.status(500).json({
      message: "Server Error",
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

    const allowedFields = [
      "firstName",
      "middleName",
      "lastName",
      "personnelType",
      "designationName",
      "status",
      "password",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (updateData.password) {
      updateData.password = await bcrypt.hash(
        updateData.password,
        saltRounds
      );
    }

    const existingPersonnel = await Personnel.findById(id);
    if (!existingPersonnel) {
      return res.status(404).json({ message: "Personnel not found" });
    }

    // Handle image replacement
    if (req.file) {
      deleteFileIfExists(existingPersonnel.personnelImage);
      updateData.personnelImage = `/uploads/personnels/${req.file.filename}`;
    }

    const updatedPersonnel = await Personnel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

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

    const personnel = await Personnel.findById(id);
    if (!personnel) {
      return res.status(404).json({ message: "Personnel not found" });
    }

    // Delete image file
    deleteFileIfExists(personnel.personnelImage);

    await personnel.deleteOne();

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

export const getPersonnelById = async (req, res) => {
  try {
    const { id } = req.params;

    const personnel = await Personnel.findById(id).select("-password");

    if (!personnel) {
      return res.status(404).json({
        message: "Personnel not found",
      });
    }

    return res.status(200).json(personnel);
  } catch (error) {
    console.error("GET PERSONNEL BY ID ERROR:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
