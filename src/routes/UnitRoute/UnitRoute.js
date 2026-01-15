import express from 'express'
import { createUnit, getUnits, updateUnit, deleteUnit } from '../../controllers/UnitController/UnitController.js'
import { authenticateToken } from '../../middleware/authenticateMiddleware.js';
const router = express.Router()

router.post('/createunit', authenticateToken, createUnit)
router.get('/getunit', authenticateToken, getUnits)
router.put('/updateunit/:id', authenticateToken, updateUnit)
router.delete('/deleteunit/:id', authenticateToken, deleteUnit)

export default router