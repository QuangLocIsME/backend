import mongoose from 'mongoose';

const UserItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'ID người dùng là bắt buộc']
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: [true, 'ID vật phẩm là bắt buộc']
    },
    acquiredAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'used', 'sold', 'expired'],
            message: '{VALUE} không phải là trạng thái hợp lệ'
        },
        default: 'active'
    },
    // Có thể thêm thông tin về cách vật phẩm được sử dụng hoặc bán
    usedDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    soldDetails: {
        price: {
            type: Number,
            default: 0
        },
        soldAt: {
            type: Date,
            default: null
        },
        buyer: {
            type: String,
            default: null
        }
    }
}, {
    timestamps: true
});

// Index để tìm kiếm theo userId
UserItemSchema.index({ userId: 1 });
// Index để tìm kiếm theo status
UserItemSchema.index({ status: 1 });
// Index theo thời gian nhận
UserItemSchema.index({ acquiredAt: -1 });

const UserItem = mongoose.model('UserItem', UserItemSchema);

export default UserItem; 