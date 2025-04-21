import express from 'express';
import AuthRouter from '../router/AuthRouter.js';

// Proxy router để chuyển tiếp các yêu cầu từ index.js sang AuthRouter
const router = express.Router();

// Chuyển tiếp tất cả các requests tới AuthRouter
router.use('/', AuthRouter);

export default router; 