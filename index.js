import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import boxRoutes from './routes/boxRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import boxHistoryRoutes from './routes/boxHistoryRoutes.js';
import uploadRoutes from './router/uploadRoutes.js';

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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/box-history', boxHistoryRoutes);
app.use('/api/upload', uploadRoutes);

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