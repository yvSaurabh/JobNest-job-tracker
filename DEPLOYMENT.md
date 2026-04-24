# Deployment Guide

## Prerequisites

- GitHub account (for version control)
- MongoDB Atlas account (cloud database)
- Render account (backend deployment)
- Vercel or Netlify account (frontend deployment)

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create a Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create account
3. Click "Create Deployment" → Choose "Free" tier
4. Select AWS and your region
5. Click "Create"

### 1.2 Setup Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (for development) or add specific IPs
4. Click "Confirm"

### 1.3 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Set username and password
4. Click "Create User"

### 1.4 Get Connection String
1. Go to "Databases"
2. Click "Connect"
3. Choose "Drivers"
4. Copy the connection string
5. Replace `<password>` and `<username>` with your credentials

---

## Step 2: Backend Deployment (Render)

### 2.1 Push to GitHub
```bash
cd jobnest
git remote add origin https://github.com/YOUR_USERNAME/jobnest.git
git branch -M main
git push -u origin main
```

### 2.2 Create Render Service
1. Go to [Render.com](https://render.com)
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Fill in details:
   - **Name**: jobnest-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Region**: Choose closest to users

### 2.3 Set Environment Variables
In Render dashboard, go to "Environment" and add:
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/jobnest?retryWrites=true&w=majority
JWT_SECRET=<GENERATE_STRONG_SECRET>
CLIENT_URL=https://yourdomain.com
```

### 2.4 Generate Strong JWT Secret
```bash
# On your machine, run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Deploy
Click "Deploy" button. Wait for the build to complete (5-10 minutes).

**Backend URL**: `https://jobnest-backend.onrender.com`

---

## Step 3: Frontend Deployment (Vercel)

### 3.1 Update API URL
Edit `frontend/src/services/api.js`:
```javascript
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://jobnest-backend.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    }
});
```

### 3.2 Create .env.production
In frontend directory, create `.env.production`:
```
VITE_API_URL=https://jobnest-backend.onrender.com/api
```

### 3.3 Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `frontend` as the root directory
5. Add environment variables:
   ```
   VITE_API_URL=https://jobnest-backend.onrender.com/api
   ```
6. Click "Deploy"

**Frontend URL**: `https://jobnest.vercel.app`

---

## Step 4: Update CORS

### 4.1 Backend CORS Update
Update `backend/server.js`:
```javascript
const corsOptions = {
    origin: 'https://jobnest.vercel.app',
    credentials: true,
    optionsSuccessStatus: 200,
};
```

### 4.2 Redeploy Backend
Push changes to GitHub, Render will auto-redeploy.

---

## Step 5: Custom Domain (Optional)

### 5.1 Frontend Custom Domain (Vercel)
1. In Vercel, go to "Settings" → "Domains"
2. Add your domain
3. Update DNS records as instructed
4. Wait for DNS propagation (24 hours)

### 5.2 Backend Custom Domain (Render)
1. In Render, go to "Custom Domains"
2. Add domain
3. Update DNS CNAME record
4. Verify domain

---

## Monitoring & Maintenance

### Logs
- **Render Logs**: Dashboard → Logs tab
- **Vercel Logs**: Dashboard → Logs tab
- **MongoDB Logs**: Atlas → Monitoring tab

### Health Checks
```bash
# Backend health
curl https://jobnest-backend.onrender.com/api/health

# Frontend check
curl https://jobnest.vercel.app
```

### Update Dependencies
```bash
npm outdated          # Check for updates
npm update            # Update packages
npm audit fix         # Fix security issues
```

---

## Troubleshooting

### Backend not starting
1. Check environment variables in Render
2. Check MongoDB connection string
3. View Render logs for errors
4. Verify MongoDB IP whitelist includes Render IPs

### API calls failing
1. Check CORS configuration
2. Verify backend URL in frontend
3. Check JWT token in browser DevTools
4. View network tab for error details

### Database connection issues
1. Verify MongoDB connection string
2. Check database user credentials
3. Whitelist all IPs or add Render's IP
4. Verify database name in connection string

### Build failures
1. Run `npm install` locally to check for errors
2. Check build logs in Render/Vercel
3. Ensure all environment variables are set
4. Check for syntax errors

---

## Performance Tips

1. **Enable Compression**: Already enabled in Express
2. **Use CDN**: Vercel includes automatic CDN
3. **Monitor**: Use Render's monitoring dashboard
4. **Scale**: Upgrade Render plan if needed
5. **Database**: Add indexes to frequently queried fields

---

## Security Checklist

- ✅ Use HTTPS (automatic with Render & Vercel)
- ✅ Strong JWT_SECRET generated
- ✅ NODE_ENV set to production
- ✅ CORS configured for production domain
- ✅ MongoDB IP whitelist configured
- ✅ Database user has strong password
- ✅ Sensitive data in environment variables
- ✅ No secrets in version control

---

## Rollback Process

If deployment has issues:

### For Backend (Render)
1. Go to "Deployments" tab
2. Click on previous deployment
3. Click "Revert"

### For Frontend (Vercel)
1. Go to "Deployments" tab
2. Click "..." on previous deployment
3. Select "Promote to Production"

---

## Support

- Render Documentation: https://render.com/docs
- Vercel Documentation: https://vercel.com/docs
- MongoDB Documentation: https://docs.mongodb.com

For issues, check logs first, then create an issue on GitHub.
