import mongoose from 'mongoose';

const boxTypeChanceSchema = new mongoose.Schema({
    boxType: { type: String, required: true, unique: true },
    chances: {
        common: { type: Number, default: 0 },
        uncommon: { type: Number, default: 0 },
        rare: { type: Number, default: 0 },
        epic: { type: Number, default: 0 },
        legendary: { type: Number, default: 0 },
        event: { type: Number, default: 0 } // Optional for event-based boxes
    },
    isDefault: { type: Boolean, default: false } // Đánh dấu mục mặc định
}, { timestamps: true });

export const BoxTypeChance = mongoose.model('BoxTypeChance', boxTypeChanceSchema);