import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import connectDB from './config/connectDB.js';
import AuthRouter from './router/AuthRouter.js';
import ServicesRouter from './router/ServicesRouter.js';
import SecurityRouter from './router/SecurityRouter.js';
import BoxRouter from './router/BoxRouter.js';
import UploadRouter from './router/uploadRoutes.js';
import UserRouter from './router/UserRouter.js';

const app = express()
dotenv.config();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, 
  'https://luckbox-production.up.railway.app' 
];

app.use(cors({
  origin: function(origin, callback) {
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

app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  abortOnLimit: true
}));

connectDB();

// API ENDPOINT
app.use('/api/auth', AuthRouter);
app.use('/api/services', ServicesRouter);
app.use('/api/security', SecurityRouter);
app.use('/api/boxes', BoxRouter);
app.use('/api/upload', UploadRouter);
app.use('/api/users', UserRouter);

app.get('/', (req, res) => {
  res.send('API đang hoạt động!');
});

app.listen(port, () => console.log(`Server đang chạy trên cổng ${port}!`));