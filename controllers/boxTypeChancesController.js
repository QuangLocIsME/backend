import { BoxTypeChance } from '../models/boxTypeChanceModel.js';

/**
 * Lấy tất cả tỷ lệ rơi vật phẩm
 */
export const getAllBoxTypeChances = async (req, res) => {
    try {
        const chances = await BoxTypeChance.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách tỷ lệ rơi vật phẩm thành công',
            data: chances
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tỷ lệ rơi vật phẩm:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách tỷ lệ rơi vật phẩm',
            error: error.message
        });
    }
};

/**
 * Lấy tỷ lệ rơi vật phẩm của một loại hộp
 */
export const getBoxTypeChanceByType = async (req, res) => {
    try {
        const boxType = req.params.boxType.toUpperCase();
        const chance = await BoxTypeChance.findOne({ boxType });

        if (!chance) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy tỷ lệ rơi vật phẩm cho loại hộp: ${boxType}`
            });
        }

        return res.status(200).json({
            success: true,
            message: `Lấy tỷ lệ rơi vật phẩm thành công cho loại hộp: ${boxType}`,
            data: chance
        });
    } catch (error) {
        console.error('Lỗi khi lấy tỷ lệ rơi vật phẩm:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy tỷ lệ rơi vật phẩm',
            error: error.message
        });
    }
};

/**
 * Tạo tỷ lệ rơi vật phẩm mới
 */
export const createBoxTypeChance = async (req, res) => {
    try {
        const { boxType, chances } = req.body;

        // Kiểm tra nếu đã tồn tại boxType
        const existingChance = await BoxTypeChance.findOne({ boxType });
        if (existingChance) {
            return res.status(400).json({
                success: false,
                message: `Loại hộp ${boxType} đã tồn tại`
            });
        }

        const newChance = new BoxTypeChance({ boxType, chances });
        await newChance.save();

        return res.status(201).json({
            success: true,
            message: 'Tạo tỷ lệ rơi vật phẩm mới thành công',
            data: newChance
        });
    } catch (error) {
        console.error('Lỗi khi tạo tỷ lệ rơi vật phẩm mới:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo tỷ lệ rơi vật phẩm mới',
            error: error.message
        });
    }
};

/**
 * Cập nhật tỷ lệ rơi vật phẩm
 */
export const updateBoxTypeChance = async (req, res) => {
    try {
        const boxType = req.params.boxType.toUpperCase();
        const updateData = req.body;

        const updatedChance = await BoxTypeChance.findOneAndUpdate(
            { boxType },
            { chances: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedChance) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy loại hộp: ${boxType}`
            });
        }

        return res.status(200).json({
            success: true,
            message: `Cập nhật tỷ lệ rơi vật phẩm thành công cho loại hộp: ${boxType}`,
            data: updatedChance
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật tỷ lệ rơi vật phẩm:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi cập nhật tỷ lệ rơi vật phẩm',
            error: error.message
        });
    }
};

/**
 * Xóa tỷ lệ rơi vật phẩm
 */
export const deleteBoxTypeChance = async (req, res) => {
    try {
        const boxType = req.params.boxType.toUpperCase();
        const deletedChance = await BoxTypeChance.findOneAndDelete({ boxType });

        if (!deletedChance) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy loại hộp: ${boxType}`
            });
        }

        return res.status(200).json({
            success: true,
            message: `Xóa tỷ lệ rơi vật phẩm thành công cho loại hộp: ${boxType}`,
            data: deletedChance
        });
    } catch (error) {
        console.error('Lỗi khi xóa tỷ lệ rơi vật phẩm:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa tỷ lệ rơi vật phẩm',
            error: error.message
        });
    }
};