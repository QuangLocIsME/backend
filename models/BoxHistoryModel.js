import mongoose from 'mongoose';

const BoxHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'ID người dùng là bắt buộc']
    },
    boxId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Box',
        required: [true, 'ID hộp quà là bắt buộc']
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: [true, 'ID vật phẩm là bắt buộc']
    },
    openedAt: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: {
            values: ['money', 'coins'],
            message: '{VALUE} không phải là phương thức thanh toán hợp lệ'
        },
        required: [true, 'Phương thức thanh toán là bắt buộc']
    },
    price: {
        type: Number,
        required: [true, 'Giá thanh toán là bắt buộc']
    }
}, {
    timestamps: true
});

// Index để tìm kiếm theo userId
BoxHistorySchema.index({ userId: 1 });
// Index theo thời gian mở
BoxHistorySchema.index({ openedAt: -1 });

const BoxHistory = mongoose.model('BoxHistory', BoxHistorySchema);

export default BoxHistory;
