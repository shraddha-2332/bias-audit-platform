# Deployment Guide

## Product architecture

- `frontend/` is the Vite React application.
- `backend/` is the Express API.
- The product does not require an external AI service to function.
- Review history is stored by the backend and exposed through the API.

## Environment variables

### Backend

- `PORT=5000`
- `FRONTEND_URL=https://your-frontend-domain.vercel.app`

### Frontend

- `VITE_API_URL=https://your-backend-domain.up.railway.app`

## Local run

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

## Recommended deployment

### Backend on Railway

1. Create a Railway project from this GitHub repository.
2. Set the root directory to `backend`.
3. Add `FRONTEND_URL` with your deployed frontend origin.
4. Deploy and confirm `GET /api/health` returns a healthy response.

Expected health response:

```json
{
  "status": "Inclusion Preflight API is running",
  "analyzer": "inclusion-preflight-rules-engine",
  "allowedOrigin": "http://localhost:5173"
}
```

### Frontend on Vercel

1. Import the same repository into Vercel.
2. Set the root directory to `frontend`.
3. Add `VITE_API_URL` pointing to the deployed Railway backend.
4. Build command: `npm run build`
5. Output directory: `dist`

## Post-deploy checks

1. `GET /api/health` responds from the backend.
2. The frontend can load review history from `/api/bias/history`.
3. Running a preflight review returns a report from `/api/bias/analyze`.
4. Aggregate stats load from `/api/bias/stats`.
5. Editorial guidance loads from `/api/bias/education`.

## CI

The workflow in `.github/workflows/deploy.yml` verifies backend dependency install, backend syntax checks, and frontend production build on pushes to `main`.

## Troubleshooting

### Frontend cannot reach backend

- Verify `VITE_API_URL` is correct.
- Verify the backend is deployed and the frontend origin matches `FRONTEND_URL`.
- Open the browser network tab and inspect failed requests.

### CORS errors

- Set `FRONTEND_URL` to the exact deployed frontend origin.
- Redeploy the backend after changing environment variables.

### History is empty after redeploy

- The current implementation uses local backend storage.
- If your host uses ephemeral storage, switch the history layer to a real database for persistence across deployments.
