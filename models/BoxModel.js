import mongoose from 'mongoose';

const BoxSchema = new mongoose.Schema({
    boxId: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                // Kiểm tra format: BOX-(LOVA|MEDI|HIGV|EVNT|RAND)-5 số
                return /^BOX-(LOVA|MEDI|HIGV|EVNT|RAND)-\d{5}$/.test(v);
            },
            message: props => `${props.value} không phải là một mã Box hợp lệ! Format: BOX-(LOVA|MEDI|HIGV|EVNT|RAND)-5 số`
        }
    },
    name: {
        type: String,
        required: [true, 'Tên hộp quà là bắt buộc'],
        trim: true,
        unique: true
    },
    shortDescription: {
        type: String,
        required: [true, 'Mô tả ngắn là bắt buộc'],
        trim: true,
        maxlength: [100, 'Mô tả ngắn không được vượt quá 100 ký tự']
    },
    description: {
        type: String,
        required: [true, 'Mô tả chi tiết là bắt buộc'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Giá tiền là bắt buộc'],
        min: [0, 'Giá tiền không được âm']
    },
    coinPrice: {
        type: Number,
        required: [true, 'Giá coin là bắt buộc'],
        min: [0, 'Giá coin không được âm']
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Giảm giá không được âm'],
        max: [100, 'Giảm giá không được vượt quá 100%'],
        description: 'Phần trăm giảm giá (0-100%)'
    },
    image: {
        type: String,
        required: [true, 'Tên file hình ảnh là bắt buộc'],
        trim: true,
        get: function(filename) {
            // Trả về đường dẫn đầy đủ khi truy vấn
            if (!filename) return '';
            // Chỉ trả về tên file, không kèm đường dẫn
            return `/images/boxes/${filename}`;
        },
        set: function(value) {
            // Nếu đường dẫn đầy đủ được cung cấp, lưu chỉ tên file
            if (!value) return '';
            // Lấy tên file từ đường dẫn (nếu có)
            const parts = value.split('/');
            return parts[parts.length - 1];
        }
    },
    boxType: {
        type: String,
        enum: ['LOVA', 'MEDI', 'HIGV', 'EVNT', 'RAND'],
        required: [true, 'Loại hộp quà là bắt buộc'],
        description: `
            LOVA: Hộp quà giá trị thấp (Low Value)
            MEDI: Hộp quà giá trị trung bình (Medium Value)
            HIGV: Hộp quà giá trị cao (High Value)
            EVNT: Hộp quà sự kiện đặc biệt (Event)
            RAND: Hộp quà ngẫu nhiên (Random)
        `
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
    collection: 'Boxes',
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Middleware để tự động tạo boxId dựa trên boxType và số thứ tự
BoxSchema.pre('save', async function(next) {
    try {
        // Cập nhật trường updatedAt
        this.updatedAt = Date.now();
        
        // Nếu boxId đã tồn tại, không cần tạo mới
        if (this.boxId) return next();
        
        // Lấy prefix từ boxType
        const prefix = 'BOX-' + this.boxType;
        
        // Tìm Box có cùng boxType với số thứ tự lớn nhất
        const lastBox = await mongoose.model('Box').findOne(
            { boxId: new RegExp('^' + prefix) },
            { boxId: 1 },
            { sort: { boxId: -1 } }
        );
        
        let counter = 0;
        
        // Nếu đã có Box cùng loại, lấy số thứ tự và tăng lên 1
        if (lastBox && lastBox.boxId) {
            const lastCounter = parseInt(lastBox.boxId.substring(lastBox.boxId.lastIndexOf('-') + 1), 10);
            counter = lastCounter + 1;
        }
        
        // Đảm bảo counter có 5 chữ số bằng cách thêm số 0 ở đầu
        const paddedCounter = String(counter).padStart(5, '0');
        
        // Tạo boxId mới
        this.boxId = `${prefix}-${paddedCounter}`;
        
        return next();
    } catch (error) {
        return next(error);
    }
});

const Box = mongoose.model('Box', BoxSchema);

export default Box;