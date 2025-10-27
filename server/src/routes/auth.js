// server/src/routes/auth.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { login, verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', authenticateToken, verifyToken);

export default router;