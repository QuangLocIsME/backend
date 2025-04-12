import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';

const app = express()
const port = process.env.PORT || 3030;

app.use(cors({}));
app.use(express.json());
app.use(cookieParser());
connectDB();
app.listen(port, () => console.log(`Example app listening on port ${port}!`))