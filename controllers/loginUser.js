import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function loginUser(req, res) {
    try {
        const { login, password } = req.body;
        
        // Tìm user bằng username hoặc email
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
        
        // Tạo JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: "24h" }
        );
        
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 giờ
            sameSite: "strict",
        });
        
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
            avatar: user.avatar,
            balance: user.balance,
            coins: user.coins,
            isActive: user.isActive
        };
        
        res.status(200).json({ user: userResponse });
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi đăng nhập" });
    }
}

export default loginUser;
