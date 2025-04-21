import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshTokenModel.js';
import { 
  generateAccessToken, 
  setAccessTokenCookie,
  clearAuthCookies
} from '../utils/tokenUtils.js';

const refreshToken = async (req, res) => {
  try {
    // Lấy refresh token từ cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không tìm thấy refresh token' 
      });
    }

    // Kiểm tra xem refresh token có trong database không
    const refreshTokenDoc = await RefreshToken.findOne({ 
      token: refreshToken,
      isRevoked: false
    });

    if (!refreshTokenDoc) {
      clearAuthCookies(res);
      return res.status(403).json({ 
        success: false, 
        message: 'Refresh token không hợp lệ hoặc đã bị thu hồi' 
      });
    }

    // Kiểm tra xem refresh token đã hết hạn chưa
    if (new Date() > new Date(refreshTokenDoc.expiresAt)) {
      // Thu hồi token đã hết hạn
      refreshTokenDoc.isRevoked = true;
      await refreshTokenDoc.save();
      
      clearAuthCookies(res);
      return res.status(403).json({ 
        success: false, 
        message: 'Refresh token đã hết hạn' 
      });
    }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err || !decoded.id || decoded.id.toString() !== refreshTokenDoc.userId.toString()) {
        clearAuthCookies(res);
        return res.status(403).json({ 
          success: false, 
          message: 'Refresh token không hợp lệ' 
        });
      }

      // Tìm thông tin người dùng để lấy role
      const User = (await import('../models/UserModel.js')).default;
      const user = await User.findById(decoded.id);
      
      if (!user) {
        clearAuthCookies(res);
        return res.status(403).json({ 
          success: false, 
          message: 'Không tìm thấy thông tin người dùng' 
        });
      }

      // Tạo access token mới với role
      const newAccessToken = generateAccessToken(decoded.id, user.role);
      
      // Đặt cookie mới
      setAccessTokenCookie(res, newAccessToken);

      // Gửi response thành công
      return res.status(200).json({ 
        success: true, 
        message: 'Access token đã được làm mới thành công' 
      });
    });
  } catch (error) {
    console.error('Lỗi khi làm mới token:', error);
    clearAuthCookies(res);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi làm mới token' 
    });
  }
};

export default refreshToken; 