import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routers/user.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT
app.use(express.json());
app.use(cookieParser())

app.use('/api', userRouter)

app.listen(PORT, () => {
    connectDB();
    console.log(`Server connected on: http://localhost:${PORT}`)
})