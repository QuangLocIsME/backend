import { Reward } from '../models/RewardModel.js';

/**
 * Lấy tất cả phần thưởng
 */
export const getAllRewards = async (req, res) => {
    try {
        const rewards = await Reward.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: rewards });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

/**
 * Lấy phần thưởng theo id
 */
export const getRewardById = async (req, res) => {
    try {
        const reward = await Reward.findOne({ id: req.params.id });
        if (!reward) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phần thưởng' });
        }
        res.status(200).json({ success: true, data: reward });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

/**
 * Tạo phần thưởng mới với id tự động theo dạng: {label}-{rarity}-{type}-{random}
 */
export const createReward = async (req, res) => {
    try {
        if (req.user.role === 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        const rewardid= req.body.id;
        const rewardData = req.body;
        const base = (rewardData.label || 'reward')
            .replace(/\s+/g, '')      // bỏ khoảng trắng
            .replace(/%/g, 'percent') // thay % bằng percent
            .replace(/[^a-zA-Z0-9_-]/g, '') // chỉ cho phép chữ, số, _ và -
            .toLowerCase();
        const rarity = (rewardData.rarity || 'common').toLowerCase();
        const type = (rewardData.type || 'product').toLowerCase();
        // Hàm sinh id tự động, đảm bảo không trùng
        const generateRewardId = async () => {
            let unique = false;
            let newId = '';
            while (!unique) {
                const random = Math.floor(1000 + Math.random() * 9000); // 4 số ngẫu nhiên
                newId = `${base}-${rarity}-${type}-${random}`;
                const exists = await Reward.findOne({ id: newId });
                if (!exists) unique = true; }
            return newId;};
        // Luôn sinh id tự động, bỏ qua id client gửi lên
        rewardData.id = await generateRewardId();
        const reward = new Reward(rewardData);
        await reward.save();
        res.status(201).json({
            success: true,
            message: 'Tạo phần thưởng mới thành công',
            data: reward});
    } catch (error) {
        console.error('Lỗi khi tạo phần thưởng mới:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Lỗi khi xác thực dữ liệu',
                error: validationErrors });}
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'ID phần thưởng đã tồn tại',
                error: 'Duplicate key error'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo phần thưởng mới',
            error: error.message
        });
    }
};

/**
 * Cập nhật phần thưởng
 */
export const updateReward = async (req, res) => {
    try {
        const reward = await Reward.findOneAndUpdate({ id: String(req.params.id) }, req.body, { new: true, runValidators: true });
        if (!reward) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phần thưởng' });
        }
        res.status(200).json({ success: true, data: reward });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Cập nhật thất bại', error: error.message });
    }
};

/**
 * Xóa phần thưởng
 */
export const deleteReward = async (req, res) => {
    try {
        const reward = await Reward.findOneAndDelete({ id: String(req.params.id)});
        if (!reward) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phần thưởng' });
        }
        res.status(200).json({ success: true, message: 'Xóa thành công', data: reward });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Xóa thất bại', error: error.message });
    }
};