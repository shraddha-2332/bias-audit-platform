import React from 'react';

const principles = [
  {
    title: 'A release decision matters',
    body: 'Teams need more than a score. They need to know whether to publish now, send for review, or block the draft.',
  },
  {
    title: 'Stakeholder impact beats abstract ethics',
    body: 'A useful system explains who is affected, how trust can be damaged, and what practical rewrite would reduce the risk.',
  },
  {
    title: 'Different content needs different playbooks',
    body: 'Hiring, policy, education, and product copy should not be reviewed with the exact same assumptions or examples.',
  },
];

export function KnowledgeRail({ education, stats }) {
  return (
    <aside className="knowledge-rail">
      {stats ? (
        <div className="panel">
          <p className="kicker">Portfolio signals</p>
          <h3>What your review trail is showing</h3>
          <div className="knowledge-list">
            {(stats.topCategories || []).length === 0 ? (
              <article className="knowledge-card">
                <h4>No dominant issue category yet</h4>
                <p>As more reviews are completed, the system will surface the categories that most often need remediation.</p>
              </article>
            ) : (
              stats.topCategories.map((item) => (
                <article key={item.category} className="knowledge-card">
                  <h4>{item.category}</h4>
                  <p>{item.count} flagged findings across saved reviews.</p>
                </article>
              ))
            )}
          </div>
        </div>
      ) : null}

      <div className="panel">
        <p className="kicker">Why this is different</p>
        <h3>Built as a content release gate, not a classroom demo.</h3>
        <div className="knowledge-list">
          {principles.map((item) => (
            <article key={item.title} className="knowledge-card">
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      {education ? (
        <div className="panel">
          <p className="kicker">Review guidance</p>
          <h3>Editorial principles from the API</h3>
          <div className="knowledge-list">
            {education.guides.map((item) => (
              <article key={item.id} className="knowledge-card">
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
