import express from "express";
import { getPropertiesPerItem, getItemsWithPropertyTotals } from "../../controllers/PropertiesPerItem/PropertiesPerItem.js";

const router = express.Router();

// Properties per Item
router.get("/propertytotals", getItemsWithPropertyTotals);
router.get("/item/:itemId", getPropertiesPerItem);


export default router;
