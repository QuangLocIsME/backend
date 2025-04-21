import getUserDetailsFromToken from '../services/checkUserDetailWithToken.js';

/**
 * Controller xác thực token và trả về thông tin người dùng
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const verifyToken = async (req, res) => {
    try {
        // Kiểm tra cookies tồn tại
        if (!req.cookies) {
            console.log('Không có cookies trong request');
            return res.status(401).json({
                success: false,
                message: "Không có cookies trong request"
            });
        }

        // Lấy token từ cookie
        const token = req.cookies.token;
        
        if (!token) {
            console.log('Không tìm thấy token trong cookies');
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