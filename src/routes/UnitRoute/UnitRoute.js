import express from 'express'
import { createUnit, getUnits, updateUnit, deleteUnit } from '../../controllers/UnitController/UnitController.js'
import { authenticatedToken } from '../../middleware/authenticateMiddleware.js';
const router = express.Router()

router.post('/createunit', authenticatedToken, createUnit)
router.get('/getunit', authenticatedToken, getUnits)
router.put('/updateunit', authenticatedToken, updateUnit)
router.delete('/deleteunit', authenticatedToken, deleteUnit)

export default router