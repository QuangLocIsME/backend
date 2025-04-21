import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Routes
import AuthRouter from './router/AuthRouter.js';
import UserRouter from './router/UserRouter.js';
import BoxRouter from './router/BoxRouter.js';
import ServicesRouter from './router/ServicesRouter.js';
import SecurityRouter from './router/SecurityRouter.js';
import UploadRouter from './router/uploadRoutes.js';

// Middleware
import { checkJWT } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: ['https://frontend-cuoi-kiz.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  abortOnLimit: true,
  responseOnLimit: 'File quá lớn, giới hạn là 5MB'
}));

// Serve static files
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);
app.use('/api/boxes', BoxRouter);
app.use('/api/services', ServicesRouter);
app.use('/api/security', SecurityRouter);
app.use('/api/upload', UploadRouter);

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Kết nối MongoDB thành công');
    app.listen(PORT, () => {
      console.log(`Server đang chạy trên cổng ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Lỗi kết nối MongoDB:', error);
  }); 