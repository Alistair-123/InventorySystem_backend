import express from "express";
import {
  getPropertiesPerCategory,
  getCategoryProperties
} from "../../controllers/PropertiesPerCategoy/PropertiesPerCategories.js";

const router = express.Router();

// Category Summary Report
router.get("/properties-per-category", getPropertiesPerCategory);

// Drill Down Properties per Category
router.get("/category/:categoryId/properties", getCategoryProperties);

export default router;
