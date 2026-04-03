const PLAYBOOKS = {
  hiring: {
    title: 'Hiring and job post review',
    guidance:
      'Focus on essential skills, remove coded fit language, and make accommodations and flexibility explicit.',
  },
  policy: {
    title: 'Policy and people operations review',
    guidance:
      'Policy language should be clear, consistently applicable, and careful not to exclude people with disabilities, caregiving duties, or different socioeconomic realities.',
  },
  marketing: {
    title: 'Marketing and public messaging review',
    guidance:
      'Segment by customer need or use case rather than identity stereotypes, and avoid prestige or worthiness framing.',
  },
  education: {
    title: 'Education and learner communication review',
    guidance:
      'Use asset-based language and describe support without framing learners or families as deficient.',
  },
  product: {
    title: 'Product UX and in-app copy review',
    guidance:
      'Keep prompts respectful, accessible, and realistic for people with different abilities, bandwidth, and confidence levels.',
  },
};

const ISSUE_RULES = [
  {
    id: 'gender-coded-fit',
    category: 'Hiring fairness',
    severity: 'high',
    patterns: [/\b(rockstar|ninja|aggressive|dominant|salesman|manpower|guys)\b/gi],
    title: 'Coded fit language may narrow who feels invited to apply',
    whyItMatters:
      'These phrases often correlate with lower response rates from qualified applicants who do not identify with the implied persona.',
    stakeholderImpact:
      'Job seekers may infer a preferred gender expression or workplace culture before they know the actual role expectations.',
    saferAlternative:
      'Describe concrete outcomes, collaboration style, and required skills instead of using identity-coded shorthand.',
  },
  {
    id: 'age-screening',
    category: 'Age inclusion',
    severity: 'high',
    patterns: [/\b(young|digital native|recent graduate|energetic youth|elderly|old-school)\b/gi],
    title: 'Age-linked wording may create avoidable screening risk',
    whyItMatters:
      'Age-coded language can discourage qualified people and create legal or reputational exposure when the work itself is age-neutral.',
    stakeholderImpact:
      'Applicants or readers may interpret the message as signaling who belongs, not what good performance looks like.',
    saferAlternative:
      'State the actual skills, adaptability, or pace expectations without using age labels.',
  },
  {
    id: 'accessibility-assumption',
    category: 'Accessibility',
    severity: 'high',
    patterns: [/\b(able-bodied|must be healthy|fast-paced|required thick skin|wheelchair-bound|normal person)\b/gi],
    title: 'The wording assumes one default body, mind, or work style',
    whyItMatters:
      'This can exclude disabled, neurodivergent, or chronically ill people even when accommodations would make the work or service accessible.',
    stakeholderImpact:
      'People who need support may opt out early because the text suggests they would be seen as exceptions rather than expected users or contributors.',
    saferAlternative:
      'Describe the essential task and mention that accommodations, flexibility, or alternative workflows are available.',
  },
  {
    id: 'class-signal',
    category: 'Socioeconomic access',
    severity: 'medium',
    patterns: [/\b(elite|polished background|top-tier upbringing|wealthy|luxury lifestyle|must own a car|unpaid trial)\b/gi],
    title: 'Class signals may filter for privilege instead of suitability',
    whyItMatters:
      'Requirements and brand language that assume money, transport, or social polish can shrink access for capable people.',
    stakeholderImpact:
      'Candidates, customers, or students may feel the offer was designed for people with more resources than they have.',
    saferAlternative:
      'Keep the requirement tied to the task itself and avoid prestige language unless it is genuinely essential.',
  },
  {
    id: 'racialized-language',
    category: 'Race and ethnicity',
    severity: 'high',
    patterns: [/\b(native english speaker|clean accent|foreigner|immigrant students|culturally fit|minority candidate|exotic)\b/gi],
    title: 'Identity-referential wording may create racial or nationality bias',
    whyItMatters:
      'The phrasing can imply a default identity standard or treat people from certain groups as outsiders.',
    stakeholderImpact:
      'Readers may receive the message that belonging depends on assimilation or a preferred background rather than contribution.',
    saferAlternative:
      'Specify the exact communication need or support concern without referring to identity groups as the issue.',
  },
  {
    id: 'deficit-framing',
    category: 'Dignity and tone',
    severity: 'medium',
    patterns: [/\b(struggle with|not for beginners|only a genius|underprivileged homes|hand-holding|without complaint)\b/gi],
    title: 'The draft frames people through deficit, shame, or unrealistic expectations',
    whyItMatters:
      'Even when unintentional, deficit framing lowers trust and can make the organization feel unsafe or dismissive.',
    stakeholderImpact:
      'The audience may feel judged before they understand the offer, policy, or learning environment.',
    saferAlternative:
      'Use respectful, specific language that explains support, standards, and expectations without belittling people.',
  },
];

const severityWeight = { low: 12, medium: 22, high: 34 };

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rewriteDraft(text, findings) {
  let rewritten = text;
  const uniqueFindings = [];

  findings.forEach((finding) => {
    if (!uniqueFindings.some((entry) => entry.trigger.toLowerCase() === finding.trigger.toLowerCase())) {
      uniqueFindings.push(finding);
    }
  });

  uniqueFindings
    .sort((a, b) => b.trigger.length - a.trigger.length)
    .forEach((finding) => {
      rewritten = rewritten.replace(
        new RegExp(escapeRegExp(finding.trigger), 'i'),
        finding.recommendedText
      );
    });

  return rewritten;
}

function buildStakeholderImpacts(findings) {
  return [
    {
      stakeholder: 'Primary audience',
      level: findings.some((item) => item.severity === 'high') ? 'high' : findings.length ? 'medium' : 'low',
      summary:
        findings.length === 0
          ? 'The draft is unlikely to alienate the intended audience based on the current rule set.'
          : 'Some people may feel screened out or judged before they understand the real opportunity or policy.',
    },
    {
      stakeholder: 'Compliance and reputation',
      level: findings.some((item) => item.category === 'Hiring fairness' || item.category === 'Age inclusion') ? 'high' : findings.length ? 'medium' : 'low',
      summary:
        findings.length === 0
          ? 'No major wording-based compliance signals were detected.'
          : 'The wording creates avoidable fairness and reputational risk if published without review.',
    },
    {
      stakeholder: 'Operational teams',
      level: findings.length >= 4 ? 'high' : findings.length >= 2 ? 'medium' : 'low',
      summary:
        findings.length === 0
          ? 'Minimal remediation effort should be required.'
          : 'Publishing as-is could generate unnecessary candidate drop-off, support burden, or revision work later.',
    },
  ];
}

export function analyzeText({ text, contentType = 'hiring' }) {
  const normalizedText = text.trim();
  const sentences = splitSentences(normalizedText);
  const findings = [];

  ISSUE_RULES.forEach((rule) => {
    rule.patterns.forEach((pattern) => {
      const matches = normalizedText.matchAll(pattern);
      for (const match of matches) {
        const trigger = match[0];
        const sentence = sentences.find((entry) => entry.toLowerCase().includes(trigger.toLowerCase())) || normalizedText;
        findings.push({
          id: `${rule.id}-${match.index ?? 0}`,
          category: rule.category,
          severity: rule.severity,
          title: rule.title,
          trigger,
          evidence: sentence,
          whyItMatters: rule.whyItMatters,
          stakeholderImpact: rule.stakeholderImpact,
          recommendedText: rule.saferAlternative,
        });
      }
    });
  });

  const totalRisk = Math.min(100, findings.reduce((sum, item) => sum + severityWeight[item.severity], 0));
  const releaseDecision =
    findings.some((item) => item.severity === 'high') || totalRisk >= 65
      ? 'Block before publish'
      : totalRisk >= 28
        ? 'Needs human review'
        : 'Ready with minor edits';

  const playbook = PLAYBOOKS[contentType] || PLAYBOOKS.hiring;
  const issueMix = [...new Set(findings.map((item) => item.category))];

  return {
    overallRiskScore: totalRisk,
    releaseDecision,
    executiveSummary:
      findings.length === 0
        ? `The draft is broadly aligned with the ${playbook.title.toLowerCase()} playbook and does not show major wording-based fairness risks.`
        : `This draft raises ${findings.length} publication issue${findings.length > 1 ? 's' : ''} across ${issueMix.length} risk area${issueMix.length > 1 ? 's' : ''}. The strongest concerns are ${issueMix.slice(0, 2).join(' and ')}.`,
    findings,
    stakeholderImpacts: buildStakeholderImpacts(findings),
    actionPlan: findings.length
      ? [
          'Replace identity-coded or deficit-oriented phrases with specific role, policy, or audience needs.',
          'Add accommodations, flexibility, or support language where the current draft assumes one default user.',
          'Run a final human review focused on the highest-risk categories before publishing.',
        ]
      : [
          'Keep the review checklist in place for future edits.',
          'Validate with a domain reviewer if the content is especially sensitive or regulated.',
        ],
    rewrittenDraft: rewriteDraft(normalizedText, findings),
    reviewChecklist: [
      'Does the wording describe the requirement, not the person you assume will succeed?',
      'Could someone with different abilities, age, background, or resources still see themselves included?',
      'Are support, flexibility, or accommodations named where relevant?',
      'Would this draft still feel respectful if read by the people most affected by it?',
    ],
    playbook,
    meta: {
      reviewedAt: new Date().toISOString(),
      analyzer: 'inclusion-preflight-rules-engine',
      contentType,
    },
  };
}
