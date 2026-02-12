import Personnel from "../../models/Personnel/Personnel.js";
import bcrypt from "bcryptjs";

/* ================================
   ✅ GET MY PROFILE
================================ */
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Personnel.findById(req.personnel.id).select(
      "-password -refreshToken"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

/* ================================
   ✅ UPDATE MY PROFILE
================================ */
export const updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;

    // ❌ Prevent updating role or personnelId
    delete updates.role;
    delete updates.personnelId;
    delete updates.refreshToken;

    const updatedProfile = await Personnel.findByIdAndUpdate(
      req.personnel.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    res.json({
      message: "Profile updated successfully.",
      updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed.", error });
  }
};

/* ================================
   ✅ UPDATE PASSWORD
================================ */
export const updateMyPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const personnel = await Personnel.findById(req.personnel.id);

    if (!personnel) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await personnel.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect." });
    }

    personnel.password = newPassword;
    await personnel.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Password update failed." });
  }
};

/* ================================
   ✅ UPDATE PROFILE IMAGE
================================ */
export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    const updated = await Personnel.findByIdAndUpdate(
      req.personnel.id,
      { personnelImage: req.file.filename },
      { new: true }
    ).select("-password -refreshToken");

    res.json({
      message: "Profile image updated successfully.",
      updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Image update failed." });
  }
};

