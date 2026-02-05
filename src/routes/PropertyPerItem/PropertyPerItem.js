import express from "express";
import { getPropertiesPerItem } from "../../controllers/PropertiesPerItem/PropertiesPerItem.js";

const router = express.Router();

// Properties per Item
router.get("/item/:itemId", getPropertiesPerItem);

export default router;
