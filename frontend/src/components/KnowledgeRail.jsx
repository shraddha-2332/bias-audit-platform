import React, { useMemo, useState } from 'react';
import { FiSearch, FiShield, FiUsers } from 'react-icons/fi';

const principles = [
  {
    title: 'Review task completion, not just compliance',
    body: 'A good audit should reveal whether a person can actually finish the service, not simply whether the page contains technical issues.',
  },
  {
    title: 'Write for first-time users',
    body: 'Essential services fail most often when they assume confidence, prior knowledge, or endless patience from the user.',
  },
  {
    title: 'Design support paths on purpose',
    body: 'Translation, human assistance, and alternate completion channels should feel normal, not exceptional.',
  },
];

const personas = [
  {
    title: 'First-time applicant',
    body: 'Needs calm, explicit guidance and a clear sense of what happens next.',
  },
  {
    title: 'Low-bandwidth user',
    body: 'May be working from shared devices, intermittent connections, or short access windows.',
  },
  {
    title: 'Translation-dependent user',
    body: 'Needs straightforward wording and visible support cues instead of language-heavy gatekeeping.',
  },
];

const coverageAreas = [
  'Launch decisions for essential services',
  'Accessibility, language, tone, and document burden',
  'Malicious, deceptive, or hostile wording',
];

function formatTrackName(value) {
  if (!value) return 'General';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function KnowledgeRail({ education, stats, history = [] }) {
  const [historyFilter, setHistoryFilter] = useState('');

  const filteredHistory = useMemo(() => {
    const query = historyFilter.trim().toLowerCase();
    if (!query) return history;
    return history.filter((item) => {
      const haystack = `${item.contentType} ${item.intent} ${item.audience} ${item.textPreview}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [history, historyFilter]);

  return (
    <aside className="knowledge-rail">
      <div className="panel rail-spotlight">
        <p className="kicker">Judge quick read</p>
        <h3>What makes AccessWise different</h3>
        <div className="knowledge-list">
          {coverageAreas.map((item) => (
            <article key={item} className="knowledge-card spotlight-card">
              <div className="section-title spotlight-title">
                <FiShield />
                <h4>{item}</h4>
              </div>
            </article>
          ))}
        </div>
      </div>

      {stats ? (
        <div className="panel">
          <p className="kicker">Usage snapshot</p>
          <h3>What recent audits are showing</h3>
          <div className="metric-grid rail-metric-grid">
            <div className="metric-card">
              <span>Total audits</span>
              <strong>{stats.reviews}</strong>
            </div>
            <div className="metric-card">
              <span>Blocked</span>
              <strong>{stats.blocked}</strong>
            </div>
            <div className="metric-card">
              <span>Needs redesign</span>
              <strong>{stats.needsReview}</strong>
            </div>
            <div className="metric-card">
              <span>Average risk</span>
              <strong>{stats.averageRiskScore}</strong>
            </div>
          </div>
          {(stats.topCategories || []).length ? (
            <div className="knowledge-list rail-signal-list">
              {stats.topCategories.map((item) => (
                <article key={item.category} className="knowledge-card compact-knowledge-card">
                  <h4>{item.category}</h4>
                  <p>{item.count} findings across recent audits.</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {history.length ? (
        <div className="panel">
          <div className="rail-header">
            <div>
              <p className="kicker">Recent audits</p>
              <h3>Reopen previous reviews</h3>
            </div>
            <label className="search-field">
              <FiSearch />
              <input
                value={historyFilter}
                onChange={(event) => setHistoryFilter(event.target.value)}
                placeholder="Search audits"
              />
            </label>
          </div>
          <div className="history-list">
            {filteredHistory.length === 0 ? (
              <div className="history-card empty">No previous audit matches that search yet.</div>
            ) : (
              filteredHistory.map((item) => (
                <article key={item.id} className="history-card history-card-readonly">
                  <div className="history-header">
                    <span className="history-track">{formatTrackName(item.contentType)}</span>
                    <span className="history-score">Risk {item.result?.overallRiskScore ?? 0}</span>
                  </div>
                  <p>{item.textPreview}...</p>
                </article>
              ))
            )}
          </div>
        </div>
      ) : null}

      <div className="panel">
        <p className="kicker">Evaluation lens</p>
        <h3>How the product should be judged</h3>
        <div className="knowledge-list">
          {principles.map((item) => (
            <article key={item.title} className="knowledge-card compact-knowledge-card">
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="section-title rail-subsection-title">
          <FiUsers />
          <h4>Protected users</h4>
        </div>
        <div className="knowledge-list">
          {personas.map((item) => (
            <article key={item.title} className="knowledge-card compact-knowledge-card">
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      {education ? (
        <div className="panel">
          <p className="kicker">Practical guidance</p>
          <h3>Rules the system is enforcing</h3>
          <div className="knowledge-list">
            {education.guides.map((item) => (
              <article key={item.id} className="knowledge-card compact-knowledge-card">
                <h4>{item.title}</h4>
                <p>{item.content}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
