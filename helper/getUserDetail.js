import getUserDetailsFromToken from "../services/checkUserDetailWithToken.js";

async function CheckUserDetail(req, res) {
    try {
        const token = req.cookies.token;

        const user = await getUserDetailsFromToken(token);
        if (user.logout) {
            return res.status(401).json({ msg: user.message, error: true, logout: true });
        }
        
        return res.status(200).json({
            msg: "User found", success: true, data: user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message, error: true });
    }
}

export default CheckUserDetail;