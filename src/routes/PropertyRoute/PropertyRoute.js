import express from "express";
import { getPropertyFormOptions,
         createProperty,
         getProperties,
         getPropertyById,
         updateProperty,
         deleteProperty

 } from "../../controllers/PropertyContoller/PropertyController.js";

const router = express.Router();

router.get("/form-options", getPropertyFormOptions);
router.get("/getproperties", getProperties);
router.get("/getpropertybyid/:id", getPropertyById);
router.post("/createproperty", createProperty);
router.put("/updateproperty/:id", updateProperty);
router.delete("/deleteproperty/:id", deleteProperty);


export default router;
