import mongoose from 'mongoose';

const boxHistorySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    boxId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Box',
        required: true 
    },
    itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Item',
        required: true 
    },
    openedAt: { 
        type: Date, 
        default: Date.now 
    },
    paymentMethod: { 
        type: String, 
        enum: ['coins', 'money', 'free'],
        required: true 
    },
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
    collection: 'Box_History'
});

// Middleware để cập nhật trường updatedAt trước khi lưu
boxHistorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const BoxHistory = mongoose.model('BoxHistory', boxHistorySchema);

export default BoxHistory;
