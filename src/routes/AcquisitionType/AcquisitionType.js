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


router.get("/getacquisitiontype", authenticateToken, getAcquisitionTypes);


router.put("/updateacquisitiontype/:id", authenticateToken, updateAcquisitionType);


router.delete("/deleteacquisitiontype/:id", authenticateToken, deleteAcquisitionType);

export default router;
