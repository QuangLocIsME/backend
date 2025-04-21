import jwt from 'jsonwebtoken';

// Tạo access token (thời gian ngắn - 15 phút)
export const generateAccessToken = (userId, userRole) => {
  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Tạo refresh token (thời gian dài - 7 ngày)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Đặt cookie cho access token
export const setAccessTokenCookie = (res, token) => {
  // Thiết lập môi trường luôn là production
  const isProduction = true;

  // Thiết lập cookie với các tùy chọn cần thiết
  const cookieOptions = {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 phút
    sameSite: 'none',      // Cho phép cookie giữa các domain khác nhau
    secure: true,          // Yêu cầu HTTPS
    domain: process.env.COOKIE_DOMAIN || undefined // Sử dụng domain từ biến môi trường nếu có
  };

  res.cookie('token', token, cookieOptions);
  console.log('Access token cookie đã được thiết lập:', cookieOptions);
};

// Đặt cookie cho refresh token
export const setRefreshTokenCookie = (res, token) => {
  // Thiết lập môi trường luôn là production
  const isProduction = true;

  // Thiết lập cookie với các tùy chọn cần thiết
  const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    path: '/api/auth/refresh', // Chỉ gửi cookie khi request tới endpoint refresh
    sameSite: 'none',      // Cho phép cookie giữa các domain khác nhau
    secure: true,          // Yêu cầu HTTPS
    domain: process.env.COOKIE_DOMAIN || undefined // Sử dụng domain từ biến môi trường nếu có
  };

  res.cookie('refreshToken', token, cookieOptions);
  console.log('Refresh token cookie đã được thiết lập:', cookieOptions);
};

// Xóa tất cả các cookie xác thực
export const clearAuthCookies = (res) => {
  // Kiểm tra môi trường
  const isProduction = process.env.NODE_ENV === 'production';

  // Tùy chọn cookie cơ bản
  const cookieOptions = {
    maxAge: 0
  };

  // Thêm các tùy chọn cho môi trường production
  if (isProduction) {
    cookieOptions.sameSite = 'none';
    cookieOptions.secure = true;
  }

  res.cookie('token', '', cookieOptions);
  res.cookie('refreshToken', '', { 
    ...cookieOptions,
    path: '/api/auth/refresh'
  });
}; 