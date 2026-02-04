import express from "express";
import {
  createPersonnel,
  getPersonnel,
   getPersonnelById,
  updatePersonnel,
  deletePersonnel,
} from "../../controllers/PersonnelController/PersonnelController.js";
import { authenticateToken } from "../../middleware/authenticateMiddleware.js";
import { upload } from "../../configs/multer.config.js";

const router = express.Router();

/**
 * CREATE PERSONNEL (with image)
 */
router.post(
  "/create",
  authenticateToken,
  upload.single("personnelImage"),
  createPersonnel
);

/**
 * GET PERSONNEL
 */
router.get(
  "/getpersonnel",
  authenticateToken,
  getPersonnel
);

/**
 * UPDATE PERSONNEL (optional image replace)
 */
router.put(
  "/updatepersonnel/:id",
  authenticateToken,
  upload.single("personnelImage"),
  updatePersonnel
);

/**
 * DELETE PERSONNEL
 */
router.delete(
  "/deletepersonnel/:id",
  authenticateToken,
  deletePersonnel
);

router.get(
  "/getpersonnel/:id",
  authenticateToken,
  getPersonnelById
);

export default router;
