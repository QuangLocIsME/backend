import express from 'express';
import {
    getAllRewards,
    getRewardById,
    createReward,
    updateReward,
    deleteReward
} from '../controllers/RewardController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/', getAllRewards);
router.get('/:id', getRewardById);
router.post('/', authenticateToken, createReward);
router.put('/:id', authenticateToken, updateReward);
router.delete('/:id', authenticateToken, deleteReward);

export default router;