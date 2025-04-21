import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    updateUserByAdmin, 
    resetPassword,
    toggleUserStatus, 
    addBalance,
    deleteUser,
    getUserStats
} from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Bảo vệ tất cả các routes với middleware xác thực
router.use(authenticateToken);

// Routes quản lý người dùng (chỉ dành cho admin)
router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.put('/:id', updateUserByAdmin);
router.put('/:id/reset-password', resetPassword);
router.patch('/:id/toggle-status', toggleUserStatus);
router.post('/:id/add-balance', addBalance);
router.delete('/:id', deleteUser);

export default router; 