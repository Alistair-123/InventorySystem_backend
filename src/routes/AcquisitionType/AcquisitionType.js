import express from "express";
import {
  createAcquisitionType,
  getAcquisitionTypes,
  updateAcquisitionType,
  deleteAcquisitionType,
} from "../../controllers/AcquisitionTypeController/AcquisitionTypeController.js";

import { authenticateToken } from "../../middleware/authenticateMiddleware.js";

const router = express.Router();


router.post("/createacquisitiontype", authenticateToken, createAcquisitionType);


router.get("/getcquisitiontype", authenticateToken, getAcquisitionTypes);


router.put("/updatecquisitiontype/:id", authenticateToken, updateAcquisitionType);


router.delete("/deletecquisitiontype/:id", authenticateToken, deleteAcquisitionType);

export default router;
