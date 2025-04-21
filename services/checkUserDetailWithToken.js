import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

/**
 * Lấy thông tin chi tiết người dùng từ token
 * @param {string} token - JWT access token
 * @returns {Promise<object>} Thông tin người dùng hoặc thông báo lỗi
 */
const getUserDetailsFromToken = async (token) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Token đã được verify, decoded:', decoded);
    
    if (!decoded || !decoded.id) {
      return {
        logout: true,
        message: 'Token không hợp lệ hoặc thiếu thông tin ID người dùng'
      };
    }
    
    // Lấy thông tin người dùng từ database
    const user = await UserModel.findById(decoded.id);
    
    if (!user) {
      return {
        logout: true,
        message: 'Không tìm thấy thông tin người dùng'
      };
    }
    
    // Trả về thông tin người dùng, bao gồm role
    return {
      _id: user._id,
      username: user.username,
      email: user.email, 
      fullname: user.fullname,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive
    };
    
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng từ token:', error);
    
    // Kiểm tra lỗi token hết hạn
    if (error.name === 'TokenExpiredError') {
      return {
        logout: true,
        message: 'Token đã hết hạn'
      };
    }
    
    return {
      logout: true,
      message: 'Lỗi xác thực: ' + error.message
    };
  }
};

export default getUserDetailsFromToken;