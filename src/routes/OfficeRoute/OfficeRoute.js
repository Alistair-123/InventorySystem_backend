import express from 'express'
import { createOffice, getOffices, updateOffice, deleteOffice } from '../../controllers/OfficeController/OfficeController.js'
import { authenticatedToken } from '../../middleware/authenticateMiddleware.js';
const router = express.Router()

router.post('/createoffice', authenticatedToken, createOffice)
router.get('/getoffices', authenticatedToken, getOffices)
router.put('/updateoffice', authenticatedToken, updateOffice)
router.delete('/deleteoffice', authenticatedToken, deleteOffice)

export default router