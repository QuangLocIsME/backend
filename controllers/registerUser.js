import UserModel from "../models/UserModel.js"
import bcrypt from "bcrypt";
async function registerUser(req, res) {
    try{
        console.log("Đang nhận request đăng ký với dữ liệu:", req.body);
        const { fullname, username, password, email } = req.body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!fullname || !username || !password || !email) {
            console.log("Thiếu dữ liệu đầu vào:", { fullname, username, email });
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
        }
        
        // Kiểm tra email và username đã tồn tại
        const checkmail = await UserModel.findOne({email});
        const checkusername = await UserModel.findOne({username});
        
        if(checkmail || checkusername){
            console.log("Email hoặc username đã tồn tại:", 
                { emailExists: !!checkmail, usernameExists: !!checkusername });
            return res.status(400).json({ message: "Tài Khoản Hoặc Email Đã Tồn Tại" });
        }
        
        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Tạo người dùng mới
        const user = await UserModel.create({ 
            fullname, 
            username, 
            email, 
            password: hashedPassword 
        });
        
        console.log("Đăng ký thành công, ID người dùng mới:", user._id);
        
        // Trả về thông tin người dùng (không bao gồm mật khẩu)
        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email
        };
        
        res.status(201).json({ 
            message: "Đăng ký thành công",
            user: userResponse 
        });
    } catch(error) {
        console.error("Lỗi trong quá trình đăng ký:", error); 
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng ký" }); 
    }
}
export default registerUser;