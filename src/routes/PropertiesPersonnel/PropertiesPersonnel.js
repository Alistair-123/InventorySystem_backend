import express from "express";
import { getPersonnelPropertySummary, getPersonnelProperties } from "../../controllers/PropertiesPerPersonnel/PropPerPersonnel.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Properties per Personnel Summary
|--------------------------------------------------------------------------
| GET /api/personnels/properties-summary
| Supports:
|   - search
|   - pagination
*/
router.get("/properties-summary", getPersonnelPropertySummary);

/*
|--------------------------------------------------------------------------
| View All Properties of One Personnel
|--------------------------------------------------------------------------
| GET /api/personnels/:id/properties
| Supports:
|   - pagination
*/
router.get("/:id/properties", getPersonnelProperties);

export default router;