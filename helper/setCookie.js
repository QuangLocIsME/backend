import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
async function Verify(req, res) {
    try {
        const user = await await UserModel.findById(req.body.userId);
        if (user.sfa === false) {
            const tokenData = {
                id: user._id,
                email: user.email,
            };

            const token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Set to true in production
                sameSite: "strict",
                maxAge: 3600000, // 1 hour
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message, error: true });
    }
}
export default Verify;