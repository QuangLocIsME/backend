import jwt from 'jsonwebtoken';

// Tạo access token (thời gian ngắn - 15 phút)
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
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
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 phút
    sameSite: 'none',
    secure: true
  });
};

// Đặt cookie cho refresh token
export const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    sameSite: 'none',
    secure: true,
    path: '/api/auth/refresh' // Chỉ gửi cookie khi request tới endpoint refresh
  });
};

// Xóa tất cả các cookie xác thực
export const clearAuthCookies = (res) => {
  res.cookie('token', '', { 
    maxAge: 0,
    sameSite: 'none',
    secure: true
  });
  res.cookie('refreshToken', '', { 
    maxAge: 0, 
    path: '/api/auth/refresh',
    sameSite: 'none',
    secure: true
  });
}; 