import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routers/user.route.js';
import postRouter from './routers/post.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { baseProject } from './utils/dirname.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT
app.use(express.json());
app.use(cookieParser())

app.use('/uploads', express.static(path.join(baseProject, 'uploads')));


app.use('/api', userRouter)
app.use('/api', postRouter)

app.listen(PORT, () => {
    connectDB();
    console.log(`Server connected on: http://localhost:${PORT}`)
})