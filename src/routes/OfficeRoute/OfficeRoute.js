import express from 'express'
import { createOffice, getOffices, updateOffice, deleteOffice } from '../../controllers/OfficeController/OfficeController.js'
import { authenticateToken } from '../../middleware/authenticateMiddleware.js';
const router = express.Router()

router.post('/createoffice', authenticateToken, createOffice)
router.get('/getoffices', authenticateToken, getOffices)
router.put('/updateoffice', authenticateToken, updateOffice)
router.delete('/deleteoffice', authenticateToken, deleteOffice)

export default router