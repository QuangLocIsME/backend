import express from 'express';
import { spinBox } from '../controllers/BuyController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Route quay thưởng
router.post('/', authenticateToken, spinBox);

export default router;