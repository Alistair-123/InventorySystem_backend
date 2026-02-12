import express from "express";
import { getProperties } from "../../controllers/PropertyStatus/PropertyStatus.js";

const router = express.Router();

/**
 * GET PROPERTIES
 * Example:
 * /api/properties?page=1&limit=10
 * /api/properties?search=2024
 * /api/properties?status=disposed
 */
router.get("/status", getProperties);

export default router;
