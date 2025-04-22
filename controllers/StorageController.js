import { Reward } from '../models/RewardModel.js';

/**
 * Lấy danh sách vật phẩm của người dùng
 */
export const getUserRewards = async (req, res) => {
    try {
        const { username } = req.params;

        // Tìm tất cả các vật phẩm mà user sở hữu
        const rewards = await Reward.find({ assetbyuser: username });

        if (!rewards || rewards.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không sở hữu vật phẩm nào'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách vật phẩm thành công',
            data: rewards
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách vật phẩm của người dùng:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách vật phẩm',
            error: error.message
        });
    }
};