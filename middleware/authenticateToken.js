import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
    // Lấy token từ nhiều nguồn: cookie hoặc header Authorization
    let token = null;
    
    // Kiểm tra token từ header Authorization (ưu tiên)
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const headerToken = authHeader.substring(7); // Bỏ "Bearer " ở đầu
        token = headerToken;
        console.log('Đã tìm thấy token trong header Authorization');
    } 
    // Nếu không có token trong header, kiểm tra trong cookie
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log('Đã tìm thấy token trong cookie');
    }
    
    if (!token) {
        console.log('Không tìm thấy token trong request');
        return res.status(401).json({ 
            success: false, 
            message: "Không có token xác thực", 
            tokenExpired: true 
        });
    }

    console.log('Token trước khi verify:', token.substring(0, 20) + '...');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Phân loại lỗi cho frontend
            console.error('Lỗi khi verify token:', err);
            
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
                tokenInvalid: true,
                error: err.message
            });
        }
        
        console.log('Decoded token:', decoded);
        
        // Kiểm tra xem token có chứa thông tin role không
        if (!decoded.role) {
            console.log('Token không chứa role, từ chối truy cập');
            return res.status(403).json({
                success: false,
                message: "Token không chứa thông tin quyền truy cập",
                tokenInvalid: true
            });
        }
        
        req.user = decoded; 
        next();
    });
}

export default authenticateToken;