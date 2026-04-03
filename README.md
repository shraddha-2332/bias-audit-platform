# Inclusion Preflight

Inclusion Preflight is a pre-publication review tool for teams that ship language at scale. It reviews hiring copy, policy text, marketing messaging, education content, and product UX text before publication and returns a release decision, stakeholder impacts, rewrite guidance, and an audit trail.

## What makes this different

- It acts like a content release gate, not a generic bias demo.
- It gives a clear decision: `Ready with minor edits`, `Needs human review`, or `Block before publish`.
- It explains who is affected and why the wording creates risk.
- It stores review history and portfolio-level stats so teams can spot recurring problem areas.
- It works locally with a rule engine and does not require an external AI key.

## Core features

- Multi-track review flow for `hiring`, `policy`, `marketing`, `education`, and `product`.
- Draft review with actionable findings and safer rewrite suggestions.
- Stakeholder impact analysis for audience, compliance/reputation, and operations.
- Action plan and review checklist for human sign-off.
- Searchable saved review history.
- Aggregate stats endpoint for blocked drafts, average risk, and top issue categories.
- Export reports as JSON or Markdown.
- Backend-served guidance content rendered in the app.

## Product workflow

1. Choose a review track.
2. Paste the draft under review.
3. Run preflight.
4. Review the release decision and flagged findings.
5. Export the report or revise the draft.
6. Use saved history and stats to identify recurring editorial risk patterns.

## Tech stack

### Frontend

- React 18
- Vite
- Axios
- Framer Motion
- React Icons

### Backend

- Node.js
- Express
- File-backed local history store
- Rule-based inclusion review engine

## Project structure

```text
bias-audit-platform/
├─ backend/
│  ├─ controllers/
│  ├─ routes/
│  ├─ utils/
│  ├─ server.js
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  └─ package.json
├─ .github/workflows/deploy.yml
└─ DEPLOYMENT_GUIDE.md
```

## API

### `POST /api/bias/analyze`

Request:

```json
{
  "text": "We need a young rockstar engineer with flawless English.",
  "contentType": "hiring",
  "audience": "Applicants and candidates",
  "intent": "Pre-publication inclusion review"
}
```

### `GET /api/bias/history`

Returns saved review records.

### `GET /api/bias/stats`

Returns aggregate review metrics.

### `GET /api/bias/education`

Returns editorial guidance cards used by the frontend.

### `GET /api/health`

Returns service health and allowed origin.

## Local development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `VITE_API_URL` when provided and falls back to `http://localhost:5000`.

## Verification

### Backend syntax checks

```bash
node --check backend/server.js
node --check backend/controllers/biasController.js
node --check backend/utils/analysisEngine.js
```

### Frontend production build

```bash
cd frontend
npm run build
```

## Deployment

See `DEPLOYMENT_GUIDE.md` for Railway + Vercel setup.

## Current limitations

- Reviews are powered by a deterministic rules engine, so nuanced cases still benefit from human review.
- History is stored locally in the backend data store, not a shared database.
- Authentication and team-level permissions are not implemented yet.

## Next good upgrades

- Shared database-backed history and team workspaces.
- Reviewer annotations and approval states.
- Domain-specific playbooks with custom policy packs.
- File ingestion for Word or PDF review flows.
