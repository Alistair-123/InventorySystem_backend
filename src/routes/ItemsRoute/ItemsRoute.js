import express from "express";
import { getReferenceData } from "../../controllers/ItemsController/ItemsController.js";
const router = express.Router();

router.get("/reference-data", getReferenceData);

export default router;