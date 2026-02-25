import express from "express";
import { authenticateToken } from "../../middleware/authenticateMiddleware.js";
import { upload } from "../../configs/multer.config.js"; // ← use shared config

import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
  updateProfileImage,
} from "../../controllers/ProfileController/ProfileController.js";

const router = express.Router();

router.get("/me", authenticateToken, getMyProfile);
router.put("/me", authenticateToken, updateMyProfile);
router.put("/me/password", authenticateToken, updateMyPassword);
router.put(
  "/me/image",
  authenticateToken,
  upload.single("personnelImage"), // ← fieldname must match UPLOAD_PATHS key
  updateProfileImage
);

export default router;