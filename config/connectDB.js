import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {

        });
        console.log("Đã kết Nối Thành Công Với MongoDB");
    } catch (error) {
        console.error("Kết Nối Thất Bại", error);
    }
}
export default connectDB; 