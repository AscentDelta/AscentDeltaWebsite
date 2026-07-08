import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scanRouter from './routes/scan.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api', scanRouter);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`AscentDelta scan server running on http://localhost:${PORT}`));
