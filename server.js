import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import AuthRouter from './router/AuthRouter.js';
import ServicesRouter from './router/ServicesRouter.js';
import SecurityRouter from './router/SecurityRouter.js';
const app = express()
dotenv.config();
const port = process.env.PORT || 5000;

// Cấu hình CORS cho phù hợp với cả môi trường phát triển và sản xuất
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // URL từ biến môi trường
  'https://luckbox-production.up.railway.app' // URL sản xuất của Railway
];

app.use(cors({
  origin: function(origin, callback) {
    // Cho phép requests không có origin (như mobile apps hoặc curl requests)
    if(!origin) return callback(null, true);
    
    if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Không được phép bởi CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
connectDB();

// API ENDPOINT
app.use('/api/auth', AuthRouter);
app.use('/api/services', ServicesRouter);
app.use('/api/security', SecurityRouter);

// Route mặc định để kiểm tra máy chủ
app.get('/', (req, res) => {
  res.send('API đang hoạt động!');
});

app.listen(port, () => console.log(`Server đang chạy trên cổng ${port}!`));