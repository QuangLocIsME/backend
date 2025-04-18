import { Totp } from "time2fa";
import UserModel from "../../models/UserModel.js";
import * as qrcode from "qrcode";

async function createSecretkey(req, res) {
    try {
        // Lấy user ID từ middleware authenticateToken
        const userId = req.user.id;
        
        // Tìm thông tin người dùng từ DB
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found', error: true });
        }

        // Generate TOTP key for the user
        const key = Totp.generateKey({
            issuer: 'LuckyBox',
            user: user.email,
        });

        // Save secret key to the database
        user.sfa = true;
        user.sf2key = key.sf2key;
        await user.save();

        // Generate QR code for the user to scan - không lưu vào DB
        const qrCodeUrl = await qrcode.toDataURL(key.url);
        
        // Return QR code and secret key
        return res.status(200).json({
            msg: 'Key generated successfully',
            data: { qrCodeUrl, secret: key.sf2key },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message || 'Unexpected error occurred', error: true });
    }
}

export default createSecretkey;