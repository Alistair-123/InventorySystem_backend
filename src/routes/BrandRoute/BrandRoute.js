import express from 'express'
import { createBrand, getBrands, deleteBrand, updateBrand } from '../../controllers/BrandController/BrandController.js'

import { authenticateToken } from '../../middleware/authenticateMiddleware.js';

const route = express.Router();

route.post('/createbrand', authenticateToken, createBrand)
route.get('/getbrand', authenticateToken, getBrands)
route.put('/updatebrand/:id', authenticateToken, updateBrand)
route.delete('/deletebrand/:id', authenticateToken, deleteBrand)

export default route