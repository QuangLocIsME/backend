import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên vật phẩm là bắt buộc'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Mô tả vật phẩm là bắt buộc'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Hình ảnh vật phẩm là bắt buộc']
    },
    value: {
        type: Number,
        required: [true, 'Giá trị vật phẩm là bắt buộc'],
        min: [0, 'Giá trị không được âm']
    },
    rarity: {
        type: String,
        enum: {
            values: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
            message: '{VALUE} không phải là độ hiếm hợp lệ'
        },
        required: [true, 'Độ hiếm vật phẩm là bắt buộc']
    },
    dropRate: {
        type: Number,
        required: [true, 'Tỉ lệ rơi vật phẩm là bắt buộc'],
        min: [0, 'Tỉ lệ rơi không được âm'],
        max: [1, 'Tỉ lệ rơi không được vượt quá 1 (100%)']
    },
    boxIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Box',
        required: [true, 'ID của hộp quà chứa vật phẩm là bắt buộc']
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'Items'
});

// Middleware để cập nhật trường updatedAt trước khi lưu
ItemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Item = mongoose.model('Item', ItemSchema);

export default Item;
