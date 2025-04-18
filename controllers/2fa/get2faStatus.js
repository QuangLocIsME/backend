import UserModel from "../../models/UserModel.js";

/**
 * Kiểm tra trạng thái 2FA của người dùng
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - Trạng thái 2FA và thông tin liên quan
 */
async function get2faStatus(req, res) {
    try {
        const userId = req.user.id;
        
        // Tìm người dùng từ ID
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: 'Không tìm thấy người dùng', 
                error: true 
            });
        }
        
        // Trả về trạng thái 2FA
        return res.status(200).json({
            enabled: user.sfa || false,
            message: user.sfa ? 'Xác thực 2 yếu tố đã được kích hoạt' : 'Xác thực 2 yếu tố chưa được kích hoạt'
        });
    } catch (err) {
        console.error('Lỗi khi kiểm tra trạng thái 2FA:', err);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi kiểm tra trạng thái 2FA',
            error: true
        });
    }
}

export default get2faStatus; 