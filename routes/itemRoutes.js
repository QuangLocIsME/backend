import express from 'express';

// Tạo router cho API items
const router = express.Router();

// GET: Lấy danh sách items
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Danh sách items',
    data: []
  });
});

// GET: Lấy thông tin chi tiết item theo ID
router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Chi tiết item với ID: ${req.params.id}`,
    data: { id: req.params.id }
  });
});

export default router; 