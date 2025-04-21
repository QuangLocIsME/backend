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
 * Tạo phần thưởng mới
 */
export const createReward = async (req, res) => {
    try {
        const reward = new Reward(req.body);
        await reward.save();
        res.status(201).json({ success: true, data: reward });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Tạo phần thưởng thất bại', error: error.message });
    }
};

/**
 * Cập nhật phần thưởng
 */
export const updateReward = async (req, res) => {
    try {
        const reward = await Reward.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
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
        const reward = await Reward.findOneAndDelete({ id: req.params.id });
        if (!reward) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phần thưởng' });
        }
        res.status(200).json({ success: true, message: 'Xóa thành công', data: reward });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Xóa thất bại', error: error.message });
    }
};