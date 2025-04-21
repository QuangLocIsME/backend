import jwt from 'jsonwebtoken';

// Middleware kiểm tra JWT token
export const checkJWT = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Không có token xác thực", 
      tokenExpired: true 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
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
    
    req.user = user; 
    next();
  });
}; 