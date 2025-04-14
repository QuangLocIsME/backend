import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id);

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Mật khẩu cũ không đúng" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Mật khẩu đã được cập nhật" });
};

