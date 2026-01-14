import { createPersonnel, getPersonnel, updatePersonnel, deletePersonnel } from "../../controllers/PersonnelController/PersonnelController.js";
import express, { Router } from 'express';
import {authenticateToken} from '../../middleware/authenticateMiddleware.js'
const router = express.Router();

router.post('/create', authenticateToken, createPersonnel);
router.get('/getpersonnel', authenticateToken, getPersonnel)
router.put('/updatepersonnel/:id', authenticateToken, updatePersonnel)
router.delete('/deletepersonnel/:id', authenticateToken, deletePersonnel)
export default router;