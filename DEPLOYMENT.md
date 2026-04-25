# Deployment Guide

This repo is set up as a small monorepo:

- `backend/` -> Express API for Render
- `frontend/` -> Vite React app for Vercel

The deployment-ready files are already in the repo:

- `render.yaml` for a Render backend Blueprint
- `frontend/vercel.json` for SPA deep-link rewrites on Vercel
- `frontend/.env.production.example` for the frontend API URL

## Recommended Order

Deploy in this order to avoid the frontend/backend URL circular dependency:

1. Create MongoDB Atlas and get the connection string.
2. Deploy the backend to Render and note the Render URL.
3. Deploy the frontend to Vercel using the Render backend URL.
4. Update Render `CLIENT_URL` to the final Vercel production URL.
5. Redeploy the backend once.

## Step 1: MongoDB Atlas

1. Create a free MongoDB Atlas cluster.
2. Create a database user.
3. Add network access.
4. Copy your connection string.

Your final `MONGO_URI` should look like:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/jobnest?retryWrites=true&w=majority
```

## Step 2: Backend on Render

### Option A: Use `render.yaml` (recommended)

1. Push the repo to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Select this repository.
4. Render will detect [render.yaml](C:/Users/kpras/Jobnest/render.yaml).
5. Create the service and then set these environment variables in Render:

```env
MONGO_URI=your_atlas_connection_string
CLIENT_URL=https://jobnest-personal-job-application-tracker.onrender.com
```

`JWT_SECRET` is generated automatically by the Blueprint. `NODE_ENV=production` is already defined there.

### Option B: Create the service manually

Use these settings:

- Service type: `Web Service`
- Runtime: `Node`
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Set these environment variables:

```env
NODE_ENV=production
MONGO_URI=your_atlas_connection_string
JWT_SECRET=your_strong_secret
CLIENT_URL=https://your-frontend-project.vercel.app
```

After deploy, your backend URL will be something like:

```text
https://your-render-service.onrender.com
```

Test it:

```bash
curl https://your-render-service.onrender.com/api/health
```

## Step 3: Frontend on Vercel

The frontend already reads `VITE_API_URL` from the environment in [frontend/src/services/api.js](C:/Users/kpras/Jobnest/frontend/src/services/api.js:4), so no source-code edit is needed.

### Deploy through the dashboard

1. Import the same GitHub repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Add this environment variable:

```env
VITE_API_URL=https://jobnest-backend-tssv.onrender.com/api
```

4. Deploy.

### Why `frontend/vercel.json` matters

This app uses `BrowserRouter`, so direct refreshes on routes like `/jobs` or `/register` need a rewrite to `index.html`. That is already configured in [frontend/vercel.json](C:/Users/kpras/Jobnest/frontend/vercel.json).

After deploy, your frontend URL will be something like:

```text
https://jobnest-personal-job-application-tracker.onrender.com
```

## Step 4: Final CORS Update

Once the frontend has a stable production URL:

1. Go back to Render.
2. Set:

```env
CLIENT_URL=https://jobnest-personal-job-application-tracker.onrender.com
```

3. Trigger a redeploy of the backend.

This matches the backend CORS setup in [backend/server.js](C:/Users/kpras/Jobnest/backend/server.js:11).

## Step 5: Pre-Deploy Checks

Run these locally before pushing the final deploy commit:

```bash
cd frontend
npm run lint
npm run build
```

The frontend build is already passing locally in this repo state.

## Troubleshooting

### Frontend loads, but refresh on `/jobs` gives 404

Make sure Vercel is deploying from the `frontend` directory and that [frontend/vercel.json](C:/Users/kpras/Jobnest/frontend/vercel.json) is included in the deployed commit.

### Frontend can’t reach backend

Check:

- `VITE_API_URL` in Vercel
- backend Render URL ends with `/api`
- backend health endpoint responds
- deployed frontend was rebuilt after changing `VITE_API_URL`

### Backend returns CORS errors

Check:

- `CLIENT_URL` in Render exactly matches the Vercel production URL
- if you have preview and production frontends, set `CLIENT_URL` to a comma-separated list
- backend was redeployed after changing `CLIENT_URL`

### Backend fails to boot

Check:

- `MONGO_URI` is valid
- Atlas network access allows incoming connections
- Render logs show successful MongoDB connection

## Rollback

### Render

1. Open the service.
2. Open `Deployments`.
3. Redeploy a previous successful version.

### Vercel

1. Open the project.
2. Open `Deployments`.
3. Promote a previous successful deployment to production.

## References

- Render monorepo root directories: https://render.com/docs/monorepo-support
- Render Blueprint spec: https://render.com/docs/blueprint-spec
- Render web services: https://render.com/docs/web-services
- Vercel monorepos: https://vercel.com/docs/monorepos
- Vercel Vite SPA rewrites: https://vercel.com/docs/frameworks/frontend/vite
- Vercel rewrites: https://vercel.com/docs/rewrites
