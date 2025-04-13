import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return {
            message: "Session expired",
            logout: true,
        };
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id).select("-password");
        if (!user) {
            return {
                message: "User not found",
                logout: true,
            };
        }
        return user;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                message: "Token expired",
                logout: true,
            };
        } else {
            throw error;
        }
    }
};

export default getUserDetailsFromToken;