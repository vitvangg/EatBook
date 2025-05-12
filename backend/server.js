import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send(`
        <p>Hello</p>
        `)
})

app.listen(PORT, () => {
    console.log(`Server connected on: http://localhost:${PORT}`)
} )