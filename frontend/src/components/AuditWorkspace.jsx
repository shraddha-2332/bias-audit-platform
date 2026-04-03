import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { FiArrowRight, FiClock, FiCopy, FiFileText, FiRefreshCcw, FiSearch, FiShield } from 'react-icons/fi';
import { FindingsPanel } from './FindingsPanel';
import { ToastContainer, useToast } from './Toast';

const samples = {
  hiring:
    'We need a young rockstar engineer with flawless English, thick skin, and the stamina to work long hours without complaint.',
  policy:
    'Employees must be healthy, available on-site at all times, and personally responsible for arranging transport regardless of circumstances.',
  marketing:
    'This exclusive experience is designed for successful businessmen who value luxury and know how to win.',
  education:
    'Immigrant students from underprivileged homes may struggle with this material and will require extra hand-holding.',
  product:
    'Only advanced users will understand this flow. Not for beginners or people who need assistance.',
};

export function AuditWorkspace({ history, stats, onSaved, apiUrl }) {
  const [contentType, setContentType] = useState('hiring');
  const [audience, setAudience] = useState('Applicants and candidates');
  const [intent, setIntent] = useState('Pre-publication inclusion review');
  const [text, setText] = useState(samples.hiring);
  const [historyFilter, setHistoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(null);
  const [result, setResult] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const filteredHistory = useMemo(() => {
    const query = historyFilter.trim().toLowerCase();
    if (!query) return history;
    return history.filter((item) => {
      const haystack = `${item.contentType} ${item.intent} ${item.audience} ${item.textPreview}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [history, historyFilter]);

  const summaryMetrics = useMemo(() => {
    if (!result) return null;
    return [
      { label: 'Release decision', value: result.releaseDecision },
      { label: 'Risk score', value: String(result.overallRiskScore) },
      { label: 'Findings', value: String(result.findings.length) },
      { label: 'Analyzer', value: result.meta.analyzer },
    ];
  }, [result]);

  const runAudit = async () => {
    if (!text.trim()) {
      addToast('Add a draft before running review.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/bias/analyze`, {
        text,
        contentType,
        audience,
        intent,
      });
      setResult(response.data.data);
      setRecord(response.data.record);
      onSaved?.(response.data.record);
      addToast('Review complete. You now have a publish decision and action plan.', 'success');
    } catch (error) {
      addToast(error.response?.data?.error || 'Review failed. Check the backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportJson = () => {
    if (!record || !result) return;
    const blob = new Blob([JSON.stringify({ record, result }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `inclusion-preflight-${record.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    if (!record || !result) return;
    const markdown = [
      `# Inclusion Preflight Report`,
      ``,
      `- Decision: ${result.releaseDecision}`,
      `- Risk score: ${result.overallRiskScore}`,
      `- Review track: ${record.contentType}`,
      `- Audience: ${record.audience}`,
      `- Intent: ${record.intent}`,
      ``,
      `## Executive summary`,
      result.executiveSummary,
      ``,
      `## Action plan`,
      ...result.actionPlan.map((item) => `- ${item}`),
      ``,
      `## Findings`,
      ...(result.findings.length
        ? result.findings.map(
            (item) =>
              `- ${item.category} (${item.severity}): "${item.trigger}" -> ${item.recommendedText}`
          )
        : ['- No major findings']),
      ``,
      `## Suggested revision`,
      result.rewrittenDraft,
    ].join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `inclusion-preflight-${record.id}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <section className="workspace">
        <div className="panel hero-panel">
          <div className="hero-copy">
            <p className="kicker">Real workflow</p>
            <h2>Stop publishing exclusionary copy by accident.</h2>
            <p>
              This is a preflight checkpoint that tells teams whether a draft is ready, needs review,
              or should be blocked before release.
            </p>
          </div>
          <div className="hero-badges">
            <span><FiShield /> Publish gate</span>
            <span><FiFileText /> Action plan</span>
            <span><FiClock /> Audit trail</span>
          </div>
        </div>

        {stats ? (
          <div className="panel compact-panel">
            <div className="metric-grid compact">
              <div className="metric-card">
                <span>Total reviews</span>
                <strong>{stats.reviews}</strong>
              </div>
              <div className="metric-card">
                <span>Blocked</span>
                <strong>{stats.blocked}</strong>
              </div>
              <div className="metric-card">
                <span>Needs review</span>
                <strong>{stats.needsReview}</strong>
              </div>
              <div className="metric-card">
                <span>Average risk</span>
                <strong>{stats.averageRiskScore}</strong>
              </div>
            </div>
          </div>
        ) : null}

        <div className="panel">
          <div className="form-grid">
            <label>
              <span>Review track</span>
              <select
                value={contentType}
                onChange={(event) => {
                  const next = event.target.value;
                  setContentType(next);
                  setText(samples[next]);
                }}
              >
                <option value="hiring">Hiring</option>
                <option value="policy">Policy</option>
                <option value="marketing">Marketing</option>
                <option value="education">Education</option>
                <option value="product">Product UX</option>
              </select>
            </label>
            <label>
              <span>Audience</span>
              <input value={audience} onChange={(event) => setAudience(event.target.value)} />
            </label>
            <label>
              <span>Review intent</span>
              <input value={intent} onChange={(event) => setIntent(event.target.value)} />
            </label>
          </div>

          <label className="editor">
            <span>Draft under review</span>
            <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste the copy you want to review." />
          </label>

          <div className="actions">
            <div className="inline-actions">
              <button type="button" className="ghost-button" onClick={() => setText(samples[contentType])}>
                <FiFileText />
                Load sample
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={async () => {
                  try {
                    const clipboard = await navigator.clipboard.readText();
                    setText(clipboard);
                    addToast('Clipboard pasted into the editor.', 'success');
                  } catch {
                    addToast('Clipboard access failed.', 'error');
                  }
                }}
              >
                <FiCopy />
                Paste
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setText('');
                  setResult(null);
                  setRecord(null);
                }}
              >
                <FiRefreshCcw />
                Reset
              </button>
            </div>
            <button type="button" className="primary-button" onClick={runAudit} disabled={loading}>
              {loading ? 'Reviewing...' : 'Run preflight'}
              <FiArrowRight />
            </button>
          </div>
        </div>

        {result ? (
          <FindingsPanel
            result={result}
            record={record}
            originalText={text}
            onExport={exportJson}
            onExportMarkdown={exportMarkdown}
            metrics={summaryMetrics}
          />
        ) : null}
      </section>

      <aside className="rail">
        <div className="panel">
          <div className="rail-header">
            <p className="kicker">Recent reviews</p>
            <label className="search-field">
              <FiSearch />
              <input
                value={historyFilter}
                onChange={(event) => setHistoryFilter(event.target.value)}
                placeholder="Search reviews"
              />
            </label>
          </div>
          <div className="history-list">
            {filteredHistory.length === 0 ? (
              <div className="history-card empty">Run a review to start building an audit trail.</div>
            ) : (
              filteredHistory.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="history-card"
                  onClick={() => {
                    setContentType(item.contentType || 'hiring');
                    setAudience(item.audience || '');
                    setIntent(item.intent || '');
                    setText(item.originalText || '');
                    setRecord(item);
                    setResult(item.result);
                  }}
                >
                  <div className="history-header">
                    <span>{item.contentType}</span>
                    <strong>{item.result?.overallRiskScore ?? 0}</strong>
                  </div>
                  <p>{item.textPreview}...</p>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
