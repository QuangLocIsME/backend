import express from 'express';
import {
    getAllBoxTypeChances,
    getBoxTypeChanceByType,
    createBoxTypeChance,
    updateBoxTypeChance,
    deleteBoxTypeChance
} from '../controllers/boxTypeChancesController.js';

const router = express.Router();

// Lấy tất cả tỷ lệ rơi vật phẩm
router.get('/', getAllBoxTypeChances);

// Lấy tỷ lệ rơi vật phẩm của một loại hộp
router.get('/:boxType', getBoxTypeChanceByType);

// Tạo tỷ lệ rơi vật phẩm mới
router.post('/', createBoxTypeChance);

// Cập nhật tỷ lệ rơi vật phẩm
router.put('/:boxType', updateBoxTypeChance);

// Xóa tỷ lệ rơi vật phẩm
router.delete('/:boxType', deleteBoxTypeChance);

export default router;