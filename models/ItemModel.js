import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    value: { type: Number, required: true },
    rarity: { 
        type: String, 
        enum: ['common', 'uncommon', 'rare', 'mythical', 'legendary', 'ancient'],
        default: 'common' 
    },
    dropRate: { type: Number, default: 1 },
    boxIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Box' 
    }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'Items'
});

// Middleware để cập nhật trường updatedAt trước khi lưu
itemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
