import UserModel from "../models/UserModel.js"
import bcrypt from "bcrypt";
async function registerUser(req, res) {
    try{
        const { fullname , username , password , email} = req.body;
        
        const checkmail = await UserModel.findOne({email})
        const checkusername = await UserModel.findOne({username})
        if(checkmail || checkusername){
            return res.status(400).json({ message: "Tài Khoản Hoặc Email Đã Tồn Tại" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await UserModel.create({ fullname, email, password: hashedPassword });
        console.log("Đăng Kí Thành Công");
        res.status(201).json({ user });



    }catch(error) {
        console.error("Error during registration:", error); 
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng ký" }); 
}
}
export default registerUser;