import express from "express";
const router = express.Router();
import {getPropertiesWithDepreciation, downloadPropertiesCSV, downloadPropertiesPDF} from "../../controllers/InventorySummary/InventorySummary.js"

router.get("/getpropdepreciation", getPropertiesWithDepreciation);
router.get("/download/csv", downloadPropertiesCSV);
router.get("/download/pdf", downloadPropertiesPDF);
export default router;