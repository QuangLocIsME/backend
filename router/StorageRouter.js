import express from 'express';
import { getUserRewards } from '../controllers/StorageController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Route để lấy danh sách vật phẩm của user
router.get('/:username', authenticateToken, getUserRewards);

export default router;