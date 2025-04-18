import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  collection: 'refresh_tokens'
});

// Tạo index để tìm kiếm token nhanh
refreshTokenSchema.index({ token: 1 });

// Tạo index cho userId để lấy tất cả token của một user
refreshTokenSchema.index({ userId: 1 });

// Tạo index cho expiresAt để xóa token hết hạn dễ dàng
refreshTokenSchema.index({ expiresAt: 1 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken; 