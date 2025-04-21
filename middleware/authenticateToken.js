import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
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