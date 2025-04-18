import mongoose from 'mongoose';

const boxSchema = new mongoose.Schema({
    boxId: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                // Kiểm tra format: BOX + (LOVA|MEDI|HIGV|EVNT|RAND) + 5 số
                return /^BOX(LOVA|MEDI|HIGV|EVNT|RAND)\d{5}$/.test(v);
            },
            message: props => `${props.value} không phải là một mã Box hợp lệ! Format: BOX + (LOVA|MEDI|HIGV|EVNT|RAND) + 5 số`
        }
    },
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
    boxType: {
        type: String,
        enum: ['LOVA', 'MEDI', 'HIGV', 'EVNT', 'RAND'],
        required: true
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

// Middleware để tự động tạo boxId dựa trên boxType và số thứ tự
boxSchema.pre('save', async function(next) {
    try {
        // Cập nhật trường updatedAt
        this.updatedAt = Date.now();
        
        // Nếu boxId đã tồn tại, không cần tạo mới
        if (this.boxId) return next();
        
        // Lấy prefix từ boxType
        const prefix = 'BOX' + this.boxType;
        
        // Tìm Box có cùng boxType với số thứ tự lớn nhất
        const lastBox = await mongoose.model('Box').findOne(
            { boxId: new RegExp('^' + prefix) },
            { boxId: 1 },
            { sort: { boxId: -1 } }
        );
        
        let counter = 0;
        
        // Nếu đã có Box cùng loại, lấy số thứ tự và tăng lên 1
        if (lastBox && lastBox.boxId) {
            const lastCounter = parseInt(lastBox.boxId.substring(7), 10);
            counter = lastCounter + 1;
        }
        
        // Đảm bảo counter có 5 chữ số bằng cách thêm số 0 ở đầu
        const paddedCounter = String(counter).padStart(5, '0');
        
        // Tạo boxId mới
        this.boxId = `${prefix}${paddedCounter}`;
        
        return next();
    } catch (error) {
        return next(error);
    }
});

const Box = mongoose.model('Box', boxSchema);

export default Box;