import { createPersonnel } from "../../controllers/PersonnelController/PersonnelController.js";
import express from 'express';
const route = express.Router();

route.post('/create', createPersonnel);

export default route;