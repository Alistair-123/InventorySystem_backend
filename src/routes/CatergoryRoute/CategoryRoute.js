import express from 'express'; 
import { createCategory, 
         getCategories, 
         updateCategory, 
         deleteCategory } 
from '../../controllers/CategoryController/CategoryController.js';

import { authenticateToken } from '../../middleware/authenticateMiddleware.js';

const route = express.Router();

route.post('/createcategory', authenticateToken, createCategory);
route.get('/getcategories', authenticateToken, getCategories);
route.put('/updatecategory/:id', authenticateToken, updateCategory);
route.delete('/deletecategory/:id', authenticateToken, deleteCategory);
export default route;