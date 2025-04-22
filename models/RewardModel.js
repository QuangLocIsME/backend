import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Mã định danh do bạn đặt
    label: { type: String, required: true },
    rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'event'], required: true },
    type: { type: String, enum: ['discount', 'product', 'special', 'event'], required: true },
    value: { type: Number, default: 0 },
    assetbyuser: { type: String, default: null }, // id của user sở hữu vật phẩm
    description: { type: String },
    code: { type: String },
}, { timestamps: true });

export const Reward = mongoose.model('Reward', rewardSchema);
