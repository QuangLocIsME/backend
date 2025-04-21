import express from 'express';
import {
    getAllBoxTypeChances,
    getBoxTypeChanceByType,
    updateBoxTypeChance
} from '../controllers/boxTypeChancesController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Lấy tất cả tỷ lệ rơi vật phẩm
router.get('/', getAllBoxTypeChances);

// Lấy tỷ lệ rơi vật phẩm của một loại hộp
router.get('/:boxType', getBoxTypeChanceByType);

// Cập nhật tỷ lệ rơi vật phẩm cần quyền admin
router.put('/:boxType',authenticateToken, updateBoxTypeChance);

// Xóa route DELETE (nếu có)
// router.delete('/:boxType', deleteBoxTypeChance);

export default router;