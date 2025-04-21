import express from 'express';

// Tạo router cho API box history
const router = express.Router();

// GET: Lấy lịch sử mở hộp quà
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Lịch sử mở hộp quà',
    data: []
  });
});

// GET: Lấy lịch sử mở hộp quà của người dùng
router.get('/user/:userId', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Lịch sử mở hộp quà của người dùng: ${req.params.userId}`,
    data: []
  });
});

export default router; 