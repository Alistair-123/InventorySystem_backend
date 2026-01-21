import express from "express";
import { getReferenceData, createItem, updateItem, deleteItem, getItems } from "../../controllers/ItemsController/ItemsController.js";
const router = express.Router();
import { upload } from "../../configs/multer.config.js";
router.get("/reference-data", getReferenceData);
router.post("/createitem", upload.single("itemImage"), createItem)
router.put("/updateitem/:id", updateItem)
router.delete("/deleteitem/:id", deleteItem)
router.get("/getitems", getItems)

export default router;