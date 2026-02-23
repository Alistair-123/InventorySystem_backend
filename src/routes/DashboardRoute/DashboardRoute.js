import express from "express";
import { getDashboardStats } from "../../controllers/DashboardController/DashboardController.js";

const router = express.Router();

router.get("/dashboard", getDashboardStats);

export default router;