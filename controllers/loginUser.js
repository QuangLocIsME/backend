import UserModel from "../models/UserModel.js";
import RefreshToken from "../models/RefreshTokenModel.js";
import bcrypt from "bcryptjs";
import {
    generateAccessToken,
    generateRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie
} from "../utils/tokenUtils.js";

async function loginUser(req, res) {
    try {
        const { login, password } = req.body;
        
        const user = await UserModel.findOne({
            $or: [
                { username: login },
                { email: login }
            ]
        });
        
        if (!user) {
            return res.status(401).json({ message: "Tên đăng nhập/email hoặc mật khẩu không đúng" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Tên đăng nhập/email hoặc mật khẩu không đúng" });
        }
        
        user.lastLogin = Date.now();
        await user.save();
        
        const accessToken = generateAccessToken(user._id, user.role);
        
        // Tạo refresh token (dài hạn - 7 ngày)
        const refreshToken = generateRefreshToken(user._id);
        
        // Lưu refresh token vào database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 ngày
        
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt
        });
        
        // Thu hồi các refresh token cũ không cần thiết (giữ tối đa 5 token)
        const userTokens = await RefreshToken.find({ 
            userId: user._id,
            isRevoked: false
        }).sort({ createdAt: -1 });
        
        if (userTokens.length > 5) {
            const tokensToRevoke = userTokens.slice(5);
            await RefreshToken.updateMany(
                { _id: { $in: tokensToRevoke.map(t => t._id) } },
                { isRevoked: true }
            );
        }

        // Thiết lập cookie
        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);
        
        // Log thông tin
        console.log("Cookie đã được thiết lập:", {
            access: "token (15 phút)",
            refresh: "refreshToken (7 ngày)"
        });
        
        return res.status(200).json({ 
            success: true, 
            message: "Đăng nhập thành công", 
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi đăng nhập" });
    }
}

export default loginUser;
