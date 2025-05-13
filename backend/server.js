import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send(`
        <p>Hello</p>
        `)
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Server connected on: http://localhost:${PORT}`)
} )