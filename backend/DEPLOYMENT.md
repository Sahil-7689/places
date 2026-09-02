# 🚀 Cloud Deployment Guide (Render & Cloud Hosting)

This guide walks you through deploying your **Tourist Places Backend** to **Render** (100% free tier) so your React Native mobile APK can communicate over **HTTPS** anywhere in the world.

---

## 📋 Prerequisites

1. A GitHub or GitLab account.
2. A free account on [Render.com](https://render.com).
3. Your **Geoapify API Key**.

---

## 🛠️ Step-by-Step Deployment on Render

### Step 1: Push Code to GitHub
Push your repository to GitHub:
```bash
git add .
git commit -m "Deploy production tourist places backend"
git push origin main
```

---

### Step 2: Create Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub repo.
4. Fill in the service configuration:
   - **Name**: `tourist-places-api` (or any unique name)
   - **Root Directory**: `backend` (if repo root contains frontend and backend)
   - **Environment**: `Node`
   - **Region**: Closest to your users (e.g. *Singapore*, *Oregon*, *Frankfurt*)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

---

### Step 3: Configure Environment Variables
Under **Environment Variables**, add:
1. `NODE_ENV` = `production`
2. `GEOAPIFY_API_KEY` = `your_actual_geoapify_api_key_here`

*(Note: Render automatically assigns and manages the `PORT` variable)*.

---

### Step 4: Click "Create Web Service"
Render will automatically:
1. Run `npm install && npm run build`
2. Run `npm start` (binding to `0.0.0.0`)
3. Provision a public **HTTPS** URL like:
   ```text
   https://tourist-places-api.onrender.com
   ```

---

## 🧪 Verifying Your Deployed Backend

### 1. Health Check
```bash
curl https://tourist-places-api.onrender.com/health
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 2. Live Nearby Tourist Places Query
```bash
curl "https://tourist-places-api.onrender.com/api/v1/places/nearby?latitude=26.9124&longitude=75.7873&radius=5000"
```
**Expected Response (Top 5 Tourist Places):**
```json
{
  "success": true,
  "data": {
    "places": [
      {
        "id": "123",
        "name": "Amber Fort",
        "address": "Devisinghpura, Amer, Jaipur",
        "latitude": 26.9855,
        "longitude": 75.8513,
        "category": "Historical",
        "distance": 8.4
      }
    ]
  }
}
```

---

## 📱 Connecting React Native APK to Production URL

In [`src/services/api.ts`](file:///d:/a/src/services/api.ts), set your deployed Render URL:

```typescript
export const PRODUCTION_API_URL = 'https://tourist-places-api.onrender.com/api/v1';
```

When you build your standalone APK (e.g., using `eas build -p android --profile production`), the APK will communicate directly over HTTPS with Render, and your app will work on **any phone anywhere in the world** without running your local computer!
