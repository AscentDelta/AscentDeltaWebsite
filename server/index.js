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

app.get('/health', (_, res) => res.json({
  status: 'ok',
  uptimeSec: Math.round(process.uptime()),
  rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
}));

// Never let a stray rejection take the whole service down mid-request.
process.on('unhandledRejection', (err) => console.error('unhandledRejection:', err?.message || err));
process.on('uncaughtException', (err) => console.error('uncaughtException:', err?.message || err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`AscentDelta scan server running on http://localhost:${PORT}`));

// Keep the free Render instance awake: hit our own public /health every 10 minutes
// so the 15-minute idle spin-down never triggers. RENDER_EXTERNAL_URL is injected by
// Render automatically; locally it's absent, so this no-ops. Override with
// KEEP_ALIVE_URL if the service ever moves.
const KEEP_ALIVE_URL = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL;
if (KEEP_ALIVE_URL) {
  const ping = () =>
    fetch(`${KEEP_ALIVE_URL}/health`)
      .then((res) => console.log(`[keep-alive] ${KEEP_ALIVE_URL}/health → ${res.status}`))
      .catch((err) => console.warn(`[keep-alive] ping failed: ${err.message}`));
  setInterval(ping, 10 * 60 * 1000);
  ping();
}
