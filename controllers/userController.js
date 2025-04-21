import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Lấy danh sách tất cả người dùng (chỉ admin)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getAllUsers = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }

        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách người dùng thành công',
            data: users
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách người dùng',
            error: error.message
        });
    }
};

/**
 * Lấy thông tin người dùng theo ID (admin)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getUserById = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }

        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Lấy thông tin người dùng thành công',
            data: user
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy thông tin người dùng',
            error: error.message
        });
    }
};

/**
 * Chỉnh sửa thông tin người dùng (admin)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const updateUserByAdmin = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        
        const userId = req.params.id;
        const { fullname, phoneNumber, email, username } = req.body;
        
        // Tạo object chứa thông tin cần cập nhật
        const updateData = {};
        if (fullname) updateData.fullname = fullname;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (email) updateData.email = email;
        if (username) updateData.username = username;
        
        // Cập nhật thời gian chỉnh sửa
        updateData.updatedAt = Date.now();
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin người dùng thành công',
            data: updatedUser
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        
        // Xử lý lỗi trùng lặp
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email hoặc username đã tồn tại',
                error: 'Duplicate key error'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng',
            error: error.message
        });
    }
};

/**
 * Đặt lại mật khẩu người dùng (admin)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const resetPassword = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        
        const userId = req.params.id;
        const { newPassword } = req.body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp mật khẩu mới'
            });
        }
        
        // Kiểm tra độ dài mật khẩu mới
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
            });
        }
        
        // Tìm người dùng
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Cập nhật mật khẩu mới
        await User.findByIdAndUpdate(
            userId,
            { 
                password: hashedPassword,
                updatedAt: Date.now()
            }
        );
        
        return res.status(200).json({
            success: true,
            message: 'Đặt lại mật khẩu thành công'
        });
    } catch (error) {
        console.error('Lỗi khi đặt lại mật khẩu:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi đặt lại mật khẩu',
            error: error.message
        });
    }
};

/**
 * Vô hiệu hóa tài khoản người dùng (admin)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const toggleUserStatus = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        // Không cho phép vô hiệu hóa tài khoản admin
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Không thể vô hiệu hóa tài khoản admin'
            });
        }
        
        // Chuyển đổi trạng thái
        user.isActive = !user.isActive;
        user.updatedAt = Date.now();
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: `Đã ${user.isActive ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản người dùng thành công`,
            data: {
                userId: user._id,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái người dùng:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi thay đổi trạng thái người dùng',
            error: error.message
        });
    }
};

/**
 * Nạp tiền vào tài khoản (admin)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const addBalance = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        
        const userId = req.params.id;
        const { amount, type } = req.body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Số tiền/xu phải là số dương'
            });
        }
        
        if (!type || !['money', 'coins'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Loại nạp phải là tiền (money) hoặc xu (coins)'
            });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        // Cập nhật số dư
        if (type === 'money') {
            user.balance += Number(amount);
        } else {
            user.coins += Number(amount);
        }
        
        user.updatedAt = Date.now();
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: `Đã nạp ${type === 'money' ? amount.toLocaleString() + ' VNĐ' : amount + ' xu'} vào tài khoản thành công`,
            data: {
                userId: user._id,
                balance: user.balance,
                coins: user.coins
            }
        });
    } catch (error) {
        console.error('Lỗi khi nạp tiền/xu:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi nạp tiền/xu',
            error: error.message
        });
    }
};

/**
 * Xóa người dùng (admin)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const deleteUser = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        // Không cho phép xóa tài khoản admin
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Không thể xóa tài khoản admin'
            });
        }
        
        // Xóa avatar người dùng nếu không phải avatar mặc định
        if (user.avatar && user.avatar !== 'default-avatar.png') {
            const avatarDir = path.join(process.cwd(), '..', 'frontend', 'public', 'images', 'avatars');
            const avatarPath = path.join(avatarDir, user.avatar);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        }
        
        // Xóa người dùng
        await User.findByIdAndDelete(userId);
        
        return res.status(200).json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa người dùng',
            error: error.message
        });
    }
};

/**
 * Lấy thống kê người dùng (admin)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getUserStats = async (req, res) => {
    try {
        // Debug thông tin token
        console.log('User từ token:', req.user);
        console.log('Auth Header:', req.headers['authorization']);
        console.log('Cookies:', req.cookies);
        
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        
        // Đếm tổng số người dùng
        const userCount = await User.countDocuments();
        
        // Đếm số người dùng đang hoạt động
        const activeUsers = await User.countDocuments({ isActive: true });
        
        // Đếm số người dùng đăng ký trong 7 ngày qua
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        
        // Đếm số người mới đăng nhập trong 30 ngày qua
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentActiveUsers = await User.countDocuments({ lastLogin: { $gte: thirtyDaysAgo } });
        
        // Thống kê theo role
        const admins = await User.countDocuments({ role: 'admin' });
        const regularUsers = await User.countDocuments({ role: 'user' });
        
        return res.status(200).json({
            success: true,
            message: 'Lấy thống kê người dùng thành công',
            data: {
                userCount,
                activeUsers,
                newUsers,
                recentActiveUsers,
                roles: {
                    admin: admins,
                    user: regularUsers
                }
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy thống kê người dùng:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy thống kê người dùng',
            error: error.message
        });
    }
}; 