import { analyzeText } from '../utils/analysisEngine.js';
import { readHistory, saveRecord } from '../utils/historyStore.js';

export const analyzeBias = async (req, res) => {
  try {
    const { text, contentType, audience, intent } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text content is required',
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'Text must be less than 5000 characters',
      });
    }

    const analysisResult = analyzeText({ text, contentType });

    const analysisRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      contentType: contentType || 'hiring',
      audience: audience || 'General audience',
      intent: intent || 'Pre-publication inclusion review',
      textPreview: text.substring(0, 100),
      originalText: text,
      result: analysisResult,
    };

    await saveRecord(analysisRecord);

    res.json({
      success: true,
      data: analysisResult,
      record: analysisRecord,
    });
  } catch (error) {
    console.error('Bias analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze content',
      message: error.message,
    });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const history = await readHistory();
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
};

export const getAnalysisStats = async (req, res) => {
  try {
    const history = await readHistory();
    const reviews = history.length;
    const blocked = history.filter((entry) => entry.result?.releaseDecision === 'Block before publish').length;
    const needsReview = history.filter((entry) => entry.result?.releaseDecision === 'Needs human review').length;
    const ready = history.filter((entry) => entry.result?.releaseDecision === 'Ready with minor edits').length;

    const categoryCounts = {};
    history.forEach((entry) => {
      (entry.result?.findings || []).forEach((finding) => {
        categoryCounts[finding.category] = (categoryCounts[finding.category] || 0) + 1;
      });
    });

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([category, count]) => ({ category, count }));

    const averageRiskScore =
      reviews === 0
        ? 0
        : Math.round(
            history.reduce((sum, entry) => sum + (entry.result?.overallRiskScore || 0), 0) / reviews
          );

    res.json({
      reviews,
      blocked,
      needsReview,
      ready,
      averageRiskScore,
      topCategories,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analysis stats' });
  }
};

export const getEducationalContent = async (req, res) => {
  try {
    res.json({
      guides: [
        {
          id: 1,
          title: 'Review the requirement, not the stereotype',
          content:
            'Strong edits replace coded labels with the exact skill, support, or outcome the team means.',
          category: 'review-principle',
        },
        {
          id: 2,
          title: 'Accessibility should be explicit',
          content:
            'If a workflow supports accommodations, flexibility, remote work, or alternate channels, say that clearly instead of implying one ideal user.',
          category: 'accessibility',
        },
        {
          id: 3,
          title: 'Make review operational',
          content:
            'A credible system should tell teams what to change, who may be affected, and whether the draft is safe to publish.',
          category: 'operations',
        },
      ],
      tips: [
        'Replace coded fit language with the exact requirement.',
        'Remove class, age, or assimilation signals unless they are truly essential.',
        'Name flexibility or accommodations when the workflow allows them.',
        'Avoid deficit framing for candidates, customers, students, or employees.',
        'Use a release decision so teams know whether to publish, review, or block the draft.',
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve educational content' });
  }
};
