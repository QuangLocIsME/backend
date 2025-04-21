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
  // Kiểm tra môi trường
  const isProduction = process.env.NODE_ENV === 'production';

  // Thiết lập cookie cơ bản cho môi trường development
  const cookieOptions = {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 phút
  };

  // Thêm các tùy chọn cho môi trường production
  if (isProduction) {
    cookieOptions.sameSite = 'none';
    cookieOptions.secure = true;
  }

  res.cookie('token', token, cookieOptions);
};

// Đặt cookie cho refresh token
export const setRefreshTokenCookie = (res, token) => {
  // Kiểm tra môi trường
  const isProduction = process.env.NODE_ENV === 'production';

  // Thiết lập cookie cơ bản cho môi trường development
  const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    path: '/api/auth/refresh' // Chỉ gửi cookie khi request tới endpoint refresh
  };

  // Thêm các tùy chọn cho môi trường production
  if (isProduction) {
    cookieOptions.sameSite = 'none';
    cookieOptions.secure = true;
  }

  res.cookie('refreshToken', token, cookieOptions);
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