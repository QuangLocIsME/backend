import express from 'express';
import UserRouter from '../router/UserRouter.js';

// Proxy router để chuyển tiếp các yêu cầu từ index.js sang UserRouter
const router = express.Router();

// Chuyển tiếp tất cả các requests tới UserRouter
router.use('/', UserRouter);

export default router; 