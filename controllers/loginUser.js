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
        const tokenData = {
            id: user._id,
            email: user.email,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Cấu hình cookie để có thể truy cập từ frontend
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Chỉ dùng HTTPS trong production
            sameSite: "lax", // Thay đổi từ strict sang lax để cho phép redirect
            maxAge: 3600000,
            path: "/", // Đảm bảo cookie áp dụng cho toàn bộ trang web
        });
        
        // Log thông tin cookie
        console.log("Cookie đã được thiết lập:", {
            name: "token",
            value: token.substring(0, 20) + "...", // Chỉ hiển thị một phần của token để bảo mật
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 3600000,
                path: "/"
            }
        });
        
        return res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                avatar: user.avatar
            }
        });

        
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi đăng nhập" });
    }
}

export default loginUser;
