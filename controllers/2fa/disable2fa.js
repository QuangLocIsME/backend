import UserModel from "../../models/UserModel.js";

/**
 * Vô hiệu hóa xác thực 2 yếu tố (2FA) cho người dùng
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - Kết quả vô hiệu hóa 2FA
 */
async function disable2fa(req, res) {
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
        
        // Vô hiệu hóa 2FA
        user.sfa = false;
        user.sf2key = null;
        
        await user.save();
        
        // Trả về kết quả
        return res.status(200).json({
            success: true,
            message: 'Đã vô hiệu hóa xác thực 2 yếu tố'
        });
    } catch (err) {
        console.error('Lỗi khi vô hiệu hóa 2FA:', err);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi vô hiệu hóa xác thực 2 yếu tố',
            error: true
        });
    }
}

export default disable2fa; 