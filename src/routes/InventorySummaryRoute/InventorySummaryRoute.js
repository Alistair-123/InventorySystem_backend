import express from "express";
const router = express.Router();
import {getPropertiesWithDepreciation} from "../../controllers/InventorySummary/InventorySummary.js"

router.get("/getpropdepreciation", getPropertiesWithDepreciation);
export default router;