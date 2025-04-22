import Box from '../models/BoxModel.js';
import { BoxTypeChance } from '../models/boxTypeChanceModel.js';
import { Reward } from '../models/RewardModel.js';
import User from '../models/UserModel.js';
import UserItem from '../models/UserItemModel.js';

/**
 * API quay thưởng
 */
export const spinBox = async (req, res) => {
    try {
        const { boxId, username, type } = req.body;
        // 1. Kiểm tra hộp quà có hoạt động không và lấy giá
        const box = await Box.findOne({ boxId, isActive: true });
        if (!box) {
            return res.status(404).json({ success: false, message: 'Hộp quà không tồn tại hoặc không hoạt động' });}
        const price = type === 'money' ? box.price : box.coinPrice;
        // 2. Kiểm tra người dùng có đủ tiền hoặc coin không
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });}
        if (type === 'money' && user.balance < price || user.balance-price < 0) {
            // Kiểm tra nếu số dư âm thì không cho quay
            return res.status(400).json({ success: false, message: 'Số dư không đủ để quay' });}
        if (type === 'coins' && user.coins < price || user.coins-price < 0) {
            // Kiểm tra nếu số dư âm thì không cho quay
            return res.status(400).json({ success: false, message: 'Số xu không đủ để quay' }); }
        // 3. Kiểm tra tỷ lệ rơi vật phẩm của hộp quà
        const boxTypeChance = await BoxTypeChance.findOne({ boxType: box.boxType });
        if (!boxTypeChance) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tỷ lệ rơi vật phẩm cho hộp quà này' });}
        // 4. Xác định vật phẩm rơi dựa trên tỷ lệ
        const chances = boxTypeChance.chances;
        const rarity = getRandomRarity(chances);
        const reward = await Reward.findOne({ rarity, assetbyuser: NaN  });// vật phẩm chưa có người dùng nào sở hữu or assetbyuser là null
        if (!reward) {
            return res.status(404).json({ success: false, message: 'Không còn vật phẩm phù hợp trong kho' });}
        // 5. Kiểm tra vật phẩm trong UserItem
        //reward.assetbyuser = user._id;
        reward.assetbyuser = user.username; // Gán người dùng sở hữu vật phẩm
        await reward.save();
        // 6. Trừ tiền hoặc coin của người dùng
        if (type === 'money') {
            user.balance -= price;
        } else {
            user.coins -= price;}
        await user.save();
        // 7. Trả về kết quả
        return res.status(200).json({
            success: true,
            message: 'Quay thưởng thành công',
            data: {
                reward,
                userBalance: user.balance,
                userCoins: user.coins}
        });
    } catch (error) {
        console.error('Lỗi khi quay thưởng:', error);
        return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi quay thưởng', error: error.message });
    }
};

/**
 * Hàm xác định độ hiếm dựa trên tỷ lệ
 */
const getRandomRarity = (chances) => {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const [rarity, chance] of Object.entries(chances)) {
        cumulative += chance;
        if (random <= cumulative) {
            return rarity;
        }
    }

    return 'common'; // Mặc định nếu không khớp
};
