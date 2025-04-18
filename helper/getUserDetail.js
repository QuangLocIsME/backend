import getUserDetailsFromToken from "../services/checkUserDetailWithToken.js";

// Hàm này hoạt động như middleware trong route
async function CheckUserDetail(req, res) {
    try {
        const token = req.cookies.token;

        const user = await getUserDetailsFromToken(token);
        
        // Xử lý trường hợp người dùng đã đăng xuất
        if (user && user.logout) {
            return res.status(401).json({ 
                msg: user.message || "Phiên đăng nhập đã hết hạn", 
                error: true, 
                logout: true 
            });
        }
        
        // Trả về thông tin người dùng trong response
        return res.status(200).json({
            msg: "User found", 
            success: true, 
            data: user
        });
    } catch (err) {
        console.error("Error in CheckUserDetail:", err);
        return res.status(500).json({ 
            msg: err.message || "Lỗi máy chủ", 
            error: true 
        });
    }
}

// Hàm trợ giúp để sử dụng trực tiếp từ các module khác
export const getUserDetailFromToken = async (token) => {
    try {
        const user = await getUserDetailsFromToken(token);
        if (user && user.logout) {
            return null;
        }
        return user;
    } catch (err) {
        console.error("Error in getUserDetailFromToken:", err);
        return null;
    }
};

export default CheckUserDetail;