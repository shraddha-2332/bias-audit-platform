import React, { useEffect, useMemo, useState } from 'react';
import { AuditWorkspace } from './components/AuditWorkspace';
import { KnowledgeRail } from './components/KnowledgeRail';
import './index.css';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [education, setEducation] = useState(null);
  const [health, setHealth] = useState('Connecting to inclusive audit engine');

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
      const blocked = next.filter((entry) => entry.result?.releaseDecision === 'Block before launch').length;
      const needsReview = next.filter((entry) => entry.result?.releaseDecision === 'Needs inclusive redesign').length;
      const ready = next.filter((entry) => entry.result?.releaseDecision === 'Ready with improvements').length;
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

  const overviewMetrics = useMemo(
    () => [
      {
        label: 'Use case',
        value: 'Essential digital services',
        detail: 'Scholarship, healthcare, jobs, civic, education',
      },
      {
        label: 'What it decides',
        value: 'Launch readiness',
        detail: 'Block, redesign, or ship with improvements',
      },
      {
        label: 'Why it matters',
        value: 'Reduce exclusion early',
        detail: 'Catch friction before users abandon the flow',
      },
    ],
    []
  );

  return (
    <div className="shell">
      <div className="bg-orb bg-orb-left" />
      <div className="bg-orb bg-orb-right" />

      <header className="topbar">
        <div className="brand-lockup">
          <p className="kicker">AccessWise</p>
          <h1>Inclusive service audits for real-world digital journeys.</h1>
          <p className="subtitle">
            Review essential service flows the way a product team, policy lead, or judge would:
            understand the risk, see who is affected, and know what to fix next.
          </p>
          <div className="hero-capabilities">
            <span className="capability-pill">Inclusive UX review</span>
            <span className="capability-pill">Trust and safety screening</span>
            <span className="capability-pill">Policy-ready launch guidance</span>
          </div>
        </div>
        <div className="status-card">
          <span className="status-label">System status</span>
          <strong>{health}</strong>
          <p>Frontend and API configured for live review workflows.</p>
        </div>
      </header>

      <section className="hero-summary">
        {overviewMetrics.map((item) => (
          <article key={item.label} className="summary-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      <main className="layout">
        <AuditWorkspace onSaved={handleNewRecord} apiUrl={apiUrl} />
        <KnowledgeRail education={education} stats={stats} history={history} />
      </main>
    </div>
  );
}

export default App;
