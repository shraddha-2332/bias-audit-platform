import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { FiArrowRight, FiCopy, FiFileText, FiRefreshCcw, FiShield } from 'react-icons/fi';
import { FindingsPanel } from './FindingsPanel';
import { ToastContainer, useToast } from './Toast';

const samples = {
  scholarship:
    'Only top students with perfect English and personal laptops should apply. Upload every certificate in one session before midnight or your request will be rejected automatically. Do not contact support for exceptions.',
  healthcare:
    'Patients must complete the appointment request online without assistance. Normal users should finish this form quickly, and elderly people are expected to arrange their own help if they cannot understand the medical terms.',
  jobs:
    'Applicants must submit the form in one sitting, keep a stable high-speed connection, and provide a polished background plus clean accent for virtual screening. Incomplete submissions will not be considered.',
  civic:
    'Residents must read the full policy notice in English before applying. People without smartphones or digital payment access are responsible for finding alternatives themselves.',
  education:
    'Beginners and slow learners may struggle with this portal. Students should already know the process, attach all documents perfectly, and avoid asking for repeated clarification.',
};

const sampleScenarios = [
  {
    id: 'scholarship-rush',
    track: 'scholarship',
    title: 'Scholarship deadline trap',
    summary: 'Rigid submission language with one-session uploads and device assumptions.',
  },
  {
    id: 'hospital-support',
    track: 'healthcare',
    title: 'Hospital self-service barrier',
    summary: 'Patient booking flow that assumes independent navigation and medical confidence.',
  },
  {
    id: 'job-bandwidth',
    track: 'jobs',
    title: 'Job portal bandwidth filter',
    summary: 'Application copy that screens for network quality and polished presentation.',
  },
  {
    id: 'civic-language',
    track: 'civic',
    title: 'Civic notice exclusion',
    summary: 'English-heavy public-service messaging with payment and smartphone assumptions.',
  },
];

const trustSafetyScenarios = [
  {
    id: 'hostile',
    label: 'Hostile text',
    text: 'I am a hacker and I will exploit the system to steal data from users.',
  },
  {
    id: 'phishing',
    label: 'Phishing risk',
    text: 'Ask users to share passwords and banking details so we can process the service faster.',
  },
  {
    id: 'threat',
    label: 'Threatening language',
    text: 'If users do not comply immediately, we will attack their account and lock them out forever.',
  },
];

const trackHighlights = {
  scholarship: {
    summary: 'Best for reviewing scholarship, grant, and aid flows.',
    items: ['deadline pressure', 'document overload', 'language gatekeeping'],
    audience: 'Students, applicants, and first-time digital users',
  },
  healthcare: {
    summary: 'Best for patient intake, appointment booking, and support-heavy flows.',
    items: ['medical jargon', 'no support path', 'stressful tone'],
    audience: 'Patients, caregivers, and people needing guided help',
  },
  jobs: {
    summary: 'Best for hiring funnels, application forms, and screening instructions.',
    items: ['bandwidth assumptions', 'accent bias', 'one-sitting forms'],
    audience: 'Applicants, early-career users, and low-resource candidates',
  },
  civic: {
    summary: 'Best for government services, benefits access, and public notices.',
    items: ['English-only notices', 'device dependency', 'payment access'],
    audience: 'Citizens, residents, and multilingual public users',
  },
  education: {
    summary: 'Best for learner onboarding, portal guidance, and support instructions.',
    items: ['shame framing', 'unclear process', 'repeat-help stigma'],
    audience: 'Learners, parents, and students needing repeated orientation',
  },
};

const workflowSteps = [
  {
    step: '1',
    title: 'Choose a service context',
    body: 'Start from a realistic scenario so the audit is grounded in an actual high-stakes flow.',
  },
  {
    step: '2',
    title: 'Review the instruction layer',
    body: 'Paste the messages, notices, or onboarding copy that decide whether someone can finish the service.',
  },
  {
    step: '3',
    title: 'Use the decision and action plan',
    body: 'Read the launch verdict, understand who is affected, and apply the recommended improvements.',
  },
];

const capabilityChecks = [
  'Inclusive UX and accessibility barriers',
  'Language, documentation, and deadline pressure',
  'Unsafe, hostile, deceptive, or malicious wording',
];

export function AuditWorkspace({ onSaved, apiUrl }) {
  const [contentType, setContentType] = useState('scholarship');
  const [audience, setAudience] = useState('Students, applicants, citizens, and first-time digital users');
  const [intent, setIntent] = useState('Inclusive service audit before launch');
  const [text, setText] = useState(samples.scholarship);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(null);
  const [result, setResult] = useState(null);
  const { toasts, addToast, removeToast } = useToast();
  const activeTrack = trackHighlights[contentType];

  const summaryMetrics = useMemo(() => {
    if (!result) return null;
    return [
      { label: 'Decision', value: result.releaseDecision },
      { label: 'Risk score', value: String(result.overallRiskScore) },
      { label: 'Issues found', value: String((result.findings || []).length) },
      { label: 'Audit engine', value: 'AccessWise' },
    ];
  }, [result]);

  const runAudit = async () => {
    if (!text.trim()) {
      addToast('Add service copy before running the audit.', 'warning');
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
      addToast('Audit complete. Review the decision, impacted personas, and next actions.', 'success');
    } catch (error) {
      addToast(error.response?.data?.error || 'Audit failed. Check the backend.', 'error');
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
    anchor.download = `accesswise-audit-${record.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    if (!record || !result) return;
    const markdown = [
      `# AccessWise Inclusive Service Audit Report`,
      ``,
      `- Service decision: ${result.releaseDecision}`,
      `- Risk score: ${result.overallRiskScore}`,
      `- Service track: ${record.contentType}`,
      `- Audience: ${record.audience}`,
      `- Intent: ${record.intent}`,
      ``,
      `## Executive summary`,
      result.executiveSummary,
      ``,
      `## Action plan`,
      ...((result.actionPlan || []).map((item) => `- ${item}`)),
      ``,
      `## Findings`,
      ...((result.findings || []).length
        ? (result.findings || []).map(
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
    anchor.download = `accesswise-audit-${record.id}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="workspace">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="panel workspace-intro">
        <div className="workspace-intro-header">
          <div>
            <p className="kicker">Review workflow</p>
            <h2>Run one clear audit from service setup to launch decision.</h2>
            <p className="workspace-intro-copy">
              Choose a realistic service flow, review the language that shapes task completion, and
              let AccessWise convert that friction into a decision, impact view, and action plan.
            </p>
          </div>
          <div className="workspace-highlight">
            <span>Audit goal</span>
            <strong>Find barriers before real users get excluded</strong>
            <p>Best for scholarship, healthcare, public-service, education, and job application journeys.</p>
          </div>
        </div>
        <div className="workflow-grid">
          {workflowSteps.map((item) => (
            <article key={item.step} className="workflow-card">
              <span>{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="kicker">Sample scenarios</p>
            <h3>Start from a realistic high-stakes flow</h3>
          </div>
          <p className="section-note">Use these to demo the product fast, then replace them with your own real service content.</p>
        </div>

        <div className="scenario-grid">
          {sampleScenarios.map((scenario) => (
            <button
              type="button"
              key={scenario.id}
              className={`scenario-card ${contentType === scenario.track ? 'scenario-card-active' : ''}`}
              onClick={() => {
                setContentType(scenario.track);
                setAudience(trackHighlights[scenario.track].audience);
                setText(samples[scenario.track]);
                setResult(null);
                setRecord(null);
              }}
            >
              <span>{scenario.track}</span>
              <strong>{scenario.title}</strong>
              <p>{scenario.summary}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="panel trust-panel">
        <div className="section-heading">
          <div>
            <p className="kicker">Reliability checks</p>
            <h3>Quick-test trust and safety behavior</h3>
          </div>
          <p className="section-note">These examples help you prove the product blocks unsafe or clearly illegitimate wording, not just exclusion barriers.</p>
        </div>

        <div className="trust-grid">
          <div className="trust-card trust-card-primary">
            <div className="section-title trust-title">
              <FiShield />
              <h4>What the engine checks now</h4>
            </div>
            <ul className="plain-list compact-list">
              {capabilityChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="trust-scenario-list">
            {trustSafetyScenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className="trust-scenario-card"
                onClick={() => {
                  setText(scenario.text);
                  setIntent('Trust and safety review before launch');
                  setResult(null);
                  setRecord(null);
                  addToast(`${scenario.label} loaded into the editor.`, 'success');
                }}
              >
                <span>{scenario.label}</span>
                <strong>{scenario.text}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="panel audit-panel">
        <div className="section-heading">
          <div>
            <p className="kicker">Audit setup</p>
            <h3>Configure the service context</h3>
          </div>
          <p className="section-note">{activeTrack.summary}</p>
        </div>

        <div className="track-overview">
          <div className="track-summary-card">
            <span>Primary audience</span>
            <strong>{activeTrack.audience}</strong>
          </div>
          <div className="track-summary-card">
            <span>Common failure points</span>
            <strong>{activeTrack.items.join(', ')}</strong>
          </div>
        </div>

        <div className="form-grid">
          <label>
            <span>Service track</span>
            <select
              value={contentType}
              onChange={(event) => {
                const next = event.target.value;
                setContentType(next);
                setAudience(trackHighlights[next].audience);
                setText(samples[next]);
              }}
            >
              <option value="scholarship">Scholarship portal</option>
              <option value="healthcare">Healthcare booking</option>
              <option value="jobs">Job application</option>
              <option value="civic">Civic service</option>
              <option value="education">Education portal</option>
            </select>
          </label>
          <label>
            <span>Audience</span>
            <input value={audience} onChange={(event) => setAudience(event.target.value)} />
          </label>
          <label>
            <span>Audit intent</span>
            <input value={intent} onChange={(event) => setIntent(event.target.value)} />
          </label>
        </div>

        <label className="editor">
          <span>Portal copy or service flow under audit</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste instructions, notices, form guidance, onboarding text, or suspicious wording you want to review."
          />
        </label>

        <div className="editor-help">
          <article className="editor-help-card">
            <span>What to paste</span>
            <p>Eligibility messages, upload instructions, policy notices, warnings, form labels, onboarding steps, or unsafe wording you want to test.</p>
          </article>
          <article className="editor-help-card">
            <span>Best demo move</span>
            <p>Show one exclusion scenario first, then one trust-and-safety scenario to prove AccessWise covers both usability and reliability risk.</p>
          </article>
        </div>

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
            {loading ? 'Auditing...' : 'Run inclusive audit'}
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
      ) : (
        <div className="panel empty-results-panel">
          <p className="kicker">Result preview</p>
          <h3>Run the audit to see the launch decision, impacted users, and rewrite guidance.</h3>
          <p className="empty-results-copy">
            AccessWise will return a clear verdict, severity-based findings, stakeholder impact, persona simulation,
            and a safer rewritten version of the service copy.
          </p>
        </div>
      )}
    </section>
  );
}
