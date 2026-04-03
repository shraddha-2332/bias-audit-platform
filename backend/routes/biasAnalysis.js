import express from 'express';
import { 
  analyzeBias, 
  getAnalysisHistory,
  getAnalysisStats,
  getEducationalContent 
} from '../controllers/biasController.js';

const router = express.Router();

// Analyze text for bias
router.post('/analyze', analyzeBias);

// Get analysis history
router.get('/history', getAnalysisHistory);

// Get aggregate stats
router.get('/stats', getAnalysisStats);

// Get educational content
router.get('/education', getEducationalContent);

export default router;
