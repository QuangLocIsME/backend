import mongoose from 'mongoose';

const boxSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    },
    coinPrice: { 
        type: Number, 
        required: true,
        min: 0
    },
    image: { 
        type: String, 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
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
    collection: 'Boxes'
});

// Middleware để cập nhật trường updatedAt trước khi lưu
boxSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Box = mongoose.model('Box', boxSchema);

export default Box;