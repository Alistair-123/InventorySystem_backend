import { login, logout, authCheck, refreshTokens } from '../../controllers/authController/authController.js';
import { authenticateToken } from '../../middleware/authenticateMiddleware.js';
import express from 'express';
const route = express.Router();

route.post('/login', login);
route.post('/logout', logout);
route.get('/auth-check', authenticateToken, authCheck);
route.post('/refresh-tokens', refreshTokens);

export default route;