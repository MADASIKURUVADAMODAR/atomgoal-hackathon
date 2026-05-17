import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.routes.js';
import db from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: ['https://atomgoal-hackathon.onrender.com', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', database: 'connected' });
});

app.listen(PORT, () => {
    console.log(`[AtomGoal Server] Running on http://localhost:${PORT}`);
    console.log(`[Database] SQLite connected at ${process.env.DB_PATH || '../database/atomgoal.db'}`);
});
