import getUserDetailsFromToken from '../services/checkUserDetailWithToken.js';
import jwt from 'jsonwebtoken';

/**
 * Controller xác thực token và trả về thông tin người dùng
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const verifyToken = async (req, res) => {
    try {
        // Lấy token từ nhiều nguồn: cookie hoặc header Authorization
        let token = null;
        
        // Kiểm tra token từ cookie
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
            console.log('Đã tìm thấy token trong cookie');
        }
        
        // Kiểm tra token từ header Authorization
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const headerToken = authHeader.substring(7); // Bỏ "Bearer " ở đầu
            token = headerToken;
            console.log('Đã tìm thấy token trong header Authorization');
        }
        
        if (!token) {
            console.log('Không tìm thấy token trong cookies hoặc header');
            return res.status(401).json({
                success: false,
                message: "Không tìm thấy token xác thực"
            });
        }
        
        // Kiểm tra token và lấy thông tin người dùng
        const result = await getUserDetailsFromToken(token);
        
        // Kiểm tra kết quả từ service
        if (result.logout) {
            return res.status(401).json({
                success: false,
                message: result.message || "Token không hợp lệ"
            });
        }
        
        // Trả về thông tin người dùng nếu token hợp lệ
        return res.status(200).json({
            success: true,
            message: "Xác thực thành công",
            user: {
                id: result._id,
                username: result.username,
                email: result.email,
                fullname: result.fullname,
                avatar: result.avatar,
                role: result.role
            }
        });
        
    } catch (error) {
        console.error("Lỗi xác thực token:", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi xác thực token"
        });
    }
};

export default verifyToken; 