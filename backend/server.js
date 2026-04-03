import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import biasAnalysisRoutes from './routes/biasAnalysis.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/bias', biasAnalysisRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'Inclusion Preflight API is running',
    analyzer: 'inclusion-preflight-rules-engine',
    allowedOrigin: process.env.FRONTEND_URL || 'http://localhost:5173',
  });
});

app.listen(PORT, () => {
  console.log(`Inclusion Preflight API running on http://localhost:${PORT}`);
});
