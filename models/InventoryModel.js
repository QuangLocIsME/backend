import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    itemId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true 
    },
    acquiredAt: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'sold', 'traded'],
        default: 'active' 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true,
    collection: 'Inventory'
});

// Middleware để cập nhật trường updatedAt trước khi lưu
inventorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory; 