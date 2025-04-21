import express from 'express';
import BoxRouter from '../router/BoxRouter.js';

// Proxy router để chuyển tiếp các yêu cầu từ index.js sang BoxRouter
const router = express.Router();

// Chuyển tiếp tất cả các requests tới BoxRouter
router.use('/', BoxRouter);

export default router; 