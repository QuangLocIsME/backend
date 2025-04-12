import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    balance: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    avatar: { type: String, default: 'default-avatar.png' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    sf2key: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
    phoneNumber: { type: String }
}, {
    timestamps: true
});

// Middleware để cập nhật trường updatedAt trước khi lưu
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);

export default User;