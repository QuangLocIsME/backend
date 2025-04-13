import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import AuthRouter from './router/AuthRouter.js';

const app = express()
dotenv.config();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
connectDB();
//API ENDPOINT
app.use('/api/auth', AuthRouter);

app.listen(port, () => console.log(`Server đang chạy trên cổng ${port}!`));