import jsonwebtoken from "jsonwebtoken";
import UserModel from "../../models/UserModel.js";
import { Totp } from "time2fa";

async function validateOTP(req, res) {
    try {
        const { otp, userId } = req.body;

        // Check for missing inputs
        if (!otp || !userId) {
            return res.status(400).json({ msg: "Missing required fields: otp or userId", error: true });
        }

        // Find user by ID
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found", error: true });
        }

        // Validate OTP using sf2key instead of key
        if (!user.sf2key) {
            return res.status(400).json({ msg: "2FA is not properly set up for this user", error: true });
        }

        const isValid = Totp.validate({ passcode: otp, secret: user.sf2key });

        if (isValid) {
            const tokenData = {
                id: user._id,
                email: user.email,
            };

            // Generate the token
            const token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 3600000,
                path: "/"
            });

            return res.status(200).json({ 
                msg: "OTP validated successfully", 
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullname: user.fullname,
                    avatar: user.avatar
                }
            });
        } else {
            return res.status(400).json({ msg: "Invalid OTP", error: true });
        }

    } catch (err) {
        console.error("Error during OTP validation:", err);
        return res.status(500).json({ msg: "An error occurred. Please try again later.", error: true });
    }
}

export default validateOTP;