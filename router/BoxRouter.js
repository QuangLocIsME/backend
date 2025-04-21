import express from 'express';
import {
    getAllBoxes,
    getBoxById,
    createBox,
    updateBox,
    deleteBox,
    toggleBoxStatus,
    getBoxStats
} from '../controllers/boxController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const BoxRouter = express.Router();

// Endpoints công khai - không yêu cầu xác thực
BoxRouter.get('/', getAllBoxes);
BoxRouter.get('/stats', authenticateToken, getBoxStats);
BoxRouter.get('/:id', getBoxById);

// Endpoints yêu cầu xác thực và quyền admin
BoxRouter.post('/', authenticateToken, createBox);
BoxRouter.put('/:id', authenticateToken, updateBox);
BoxRouter.delete('/:id', authenticateToken, deleteBox);
BoxRouter.patch('/:id/toggle-status', authenticateToken, toggleBoxStatus);

export default BoxRouter; 