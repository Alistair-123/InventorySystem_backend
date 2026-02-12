import express from "express";
import { authenticateToken } from "../../middleware/authenticateMiddleware.js";

import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
  updateProfileImage,
  
} from "../../controllers/ProfileController/ProfileController.js";

import multer from "multer";

const router = express.Router();

/* Multer Upload Config */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ===========================
   PROFILE CRUD ROUTES
=========================== */

router.get("/me", authenticateToken, getMyProfile);

router.put("/me", authenticateToken, updateMyProfile);

router.put("/me/password", authenticateToken, updateMyPassword);

router.put(
  "/me/image",
  authenticateToken,
  upload.single("personnelImage"),
  updateProfileImage
);



export default router;
