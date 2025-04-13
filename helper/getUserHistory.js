import getUserDetailsFromToken from "../services/checkUserDetailWithToken.js";
import BoxHistory from '../models/BoxHistoryModel.js';


async function getUserHistory(req, res) {
    const token = req.cookies.token;
    const user = await getUserDetailsFromToken(token);
    if (user.logout) {
        return res.status(401).json({ msg: user.message, error: true, logout: true });
    }
    const history = await BoxHistory.find({ userId: user._id });
    return res.status(200).json({ msg: "History found", success: true, data: history });
}

export default getUserHistory;
