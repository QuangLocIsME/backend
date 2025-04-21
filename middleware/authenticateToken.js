import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Không có token xác thực", 
            tokenExpired: true 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Phân loại lỗi cho frontend
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false, 
                    message: "Token đã hết hạn, vui lòng làm mới token", 
                    tokenExpired: true 
                });
            }
            
            return res.status(403).json({ 
                success: false, 
                message: "Token không hợp lệ", 
                tokenInvalid: true 
            });
        }
        
        console.log('Decoded token:', decoded);
        
        // Nếu không có role trong token, lấy thông tin người dùng từ cơ sở dữ liệu
        if (decoded && decoded.id && !decoded.role) {
            console.log('Role không có trong token, sẽ được cập nhật trong lần tạo token tiếp theo');
        }
        
        req.user = decoded; 
        next();
    });
}

export default authenticateToken;