import React, { useEffect, useState } from 'react';
import { AuditWorkspace } from './components/AuditWorkspace';
import { KnowledgeRail } from './components/KnowledgeRail';
import './index.css';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [education, setEducation] = useState(null);
  const [health, setHealth] = useState('Connecting to review engine');

  useEffect(() => {
    const boot = async () => {
      try {
        const [healthResponse, historyResponse, statsResponse, educationResponse] = await Promise.all([
          fetch(`${apiUrl}/api/health`),
          fetch(`${apiUrl}/api/bias/history`),
          fetch(`${apiUrl}/api/bias/stats`),
          fetch(`${apiUrl}/api/bias/education`),
        ]);

        if (healthResponse.ok) {
          const payload = await healthResponse.json();
          setHealth(payload.status);
        }

        if (historyResponse.ok) {
          const payload = await historyResponse.json();
          setHistory(payload.history || []);
        }

        if (statsResponse.ok) {
          const payload = await statsResponse.json();
          setStats(payload);
        }

        if (educationResponse.ok) {
          const payload = await educationResponse.json();
          setEducation(payload);
        }
      } catch {
        setHealth('Backend unavailable');
      }
    };

    boot();
  }, []);

  const handleNewRecord = (record) => {
    setHistory((current) => {
      const next = [record, ...current.filter((item) => item.id !== record.id)].slice(0, 8);
      const reviews = next.length;
      const blocked = next.filter((entry) => entry.result?.releaseDecision === 'Block before publish').length;
      const needsReview = next.filter((entry) => entry.result?.releaseDecision === 'Needs human review').length;
      const ready = next.filter((entry) => entry.result?.releaseDecision === 'Ready with minor edits').length;
      const averageRiskScore =
        reviews === 0
          ? 0
          : Math.round(next.reduce((sum, entry) => sum + (entry.result?.overallRiskScore || 0), 0) / reviews);

      const categoryCounts = {};
      next.forEach((entry) => {
        (entry.result?.findings || []).forEach((finding) => {
          categoryCounts[finding.category] = (categoryCounts[finding.category] || 0) + 1;
        });
      });

      setStats({
        reviews,
        blocked,
        needsReview,
        ready,
        averageRiskScore,
        topCategories: Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([category, count]) => ({ category, count })),
      });

      return next;
    });
  };

  return (
    <div className="shell">
      <div className="bg-orb bg-orb-left" />
      <div className="bg-orb bg-orb-right" />

      <header className="topbar">
        <div>
          <p className="kicker">Trust Intelligence Platform</p>
          <h1>Inclusion Preflight</h1>
          <p className="subtitle">
            A publication gate for hiring, policy, marketing, education, and product copy.
          </p>
        </div>
        <div className="status-chip">{health}</div>
      </header>

      <main className="layout">
        <AuditWorkspace history={history} stats={stats} onSaved={handleNewRecord} apiUrl={apiUrl} />
        <KnowledgeRail education={education} stats={stats} />
      </main>
    </div>
  );
}

export default App;
