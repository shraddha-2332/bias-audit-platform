import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import biasAnalysisRoutes from './routes/biasAnalysis.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (configuredOrigins.includes(origin)) return true;

  return /^https:\/\/accesswise-frontend(?:-[a-z0-9-]+)?-shraddha-2332s-projects\.vercel\.app$/i.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/bias', biasAnalysisRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'AccessWise inclusive audit API is running',
    analyzer: 'accesswise-inclusive-service-engine',
    allowedOrigin: configuredOrigins,
  });
});

app.listen(PORT, () => {
  console.log(`AccessWise API running on http://localhost:${PORT}`);
});
