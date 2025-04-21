import express from 'express';
import { uploadBoxImage, deleteBoxImage } from '../controllers/uploadController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Yêu cầu xác thực cho tất cả các routes

// Route upload ảnh cho hộp quà
router.post('/boxes',authenticateToken, uploadBoxImage);

// Route xóa ảnh hộp quà
router.delete('/boxes/:fileName',authenticateToken, deleteBoxImage);

export default router; 