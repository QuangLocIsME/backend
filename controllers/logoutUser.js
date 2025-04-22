import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshTokenModel.js';
import { clearAuthCookies } from '../utils/tokenUtils.js';

const logoutUser = async (req, res) => {
    try {
        // Xóa tất cả các cookie xác thực
        clearAuthCookies(res);
        // Lấy refresh token từ cookie
        const refreshToken = req.cookies.refreshToken;
        // Nếu có refresh token, thu hồi nó trong database
        if (refreshToken) {
            try {
                // Verify refresh token để lấy userId
                const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

                if (decoded && decoded.id) {
                    // Thu hồi refresh token hiện tại
                    await RefreshToken.updateOne(
                        { token: refreshToken },
                        { isRevoked: true }
                    );
                    console.log(`Đã thu hồi refresh token cho user: ${decoded.id}`);
                }
            } catch (error) {
                // Lỗi verify token không ảnh hưởng đến quá trình đăng xuất
                console.error('Lỗi khi verify refresh token:', error.message);
            }
        }
        res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi đăng xuất' });
    }
};
export default logoutUser;

