import React from 'react';
import { FiAlertTriangle, FiCheckCircle, FiCopy, FiDownload, FiUsers } from 'react-icons/fi';

export function FindingsPanel({ result, metrics, originalText, onExport, onExportMarkdown }) {
  return (
    <section className="results">
      <div className="panel">
        <div className="results-top">
          <div>
            <p className="kicker">Decision</p>
            <h3>{result.releaseDecision}</h3>
            <p className="results-summary">{result.executiveSummary}</p>
          </div>
          <div className="inline-actions">
            <button type="button" className="ghost-button" onClick={async () => navigator.clipboard.writeText(result.rewrittenDraft)}>
              <FiCopy />
              Copy rewrite
            </button>
            <button type="button" className="ghost-button" onClick={onExportMarkdown}>
              <FiDownload />
              Export markdown
            </button>
            <button type="button" className="ghost-button" onClick={onExport}>
              <FiDownload />
              Export json
            </button>
          </div>
        </div>

        <div className="metric-grid">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-card">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="results-grid">
        <div className="panel">
          <div className="section-title">
            <FiAlertTriangle />
            <h4>Findings</h4>
          </div>
          <div className="finding-list">
            {result.findings.length === 0 ? (
              <div className="finding-card success">
                <strong>No major findings</strong>
                <p>The draft is in good shape based on the current rule set.</p>
              </div>
            ) : (
              result.findings.map((item) => (
                <article key={item.id} className="finding-card">
                  <div className="finding-head">
                    <span>{item.category}</span>
                    <strong>{item.severity}</strong>
                  </div>
                  <h5>{item.title}</h5>
                  <p><strong>Trigger:</strong> "{item.trigger}"</p>
                  <p><strong>Why it matters:</strong> {item.whyItMatters}</p>
                  <p><strong>Stakeholder impact:</strong> {item.stakeholderImpact}</p>
                  <p><strong>Safer rewrite:</strong> {item.recommendedText}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="stack">
          <div className="panel">
            <div className="section-title">
              <FiUsers />
              <h4>Stakeholder impacts</h4>
            </div>
            <div className="impact-list">
              {result.stakeholderImpacts.map((item) => (
                <div key={item.stakeholder} className="impact-card">
                  <div className="finding-head">
                    <span>{item.stakeholder}</span>
                    <strong>{item.level}</strong>
                  </div>
                  <p>{item.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-title">
              <FiCheckCircle />
              <h4>Action plan</h4>
            </div>
            <ul className="plain-list">
              {result.actionPlan.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h5 className="subheading">Review checklist</h5>
            <ul className="plain-list">
              {result.reviewChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="results-grid">
        <div className="panel">
          <p className="kicker">Original draft</p>
          <pre className="text-block">{originalText}</pre>
        </div>
        <div className="panel">
          <p className="kicker">Suggested revision</p>
          <pre className="text-block">{result.rewrittenDraft}</pre>
        </div>
      </div>
    </section>
  );
}
