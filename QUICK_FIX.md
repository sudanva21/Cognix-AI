# 🚨 Quick Fix: API Errors on Vercel

## The Problem
You deployed to Vercel but getting errors like:
- **"User not found"**
- **401 Unauthorized**
- **"Authentication Error"**

## The Solution (5 minutes)

### Step 1: Get Your API Keys

**OpenRouter API Key:**
1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign in or create an account
3. Click "Create Key"
4. Copy the key (starts with `sk-or-v1-...`)

**Supabase Credentials:**
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Open your COGNIX project
3. Click **Settings** (⚙️) → **API**
4. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 2: Add to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Open your COGNIX project
3. Click **Settings** tab
4. Click **Environment Variables**
5. Add these THREE variables:

**Variable 1:**
- Name: `VITE_OPENROUTER_API_KEY`
- Value: `sk-or-v1-...` (paste your OpenRouter key)
- Environment: Check all three (Production, Preview, Development)

**Variable 2:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://your-project-id.supabase.co` (paste your URL)
- Environment: Check all three (Production, Preview, Development)

**Variable 3:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGc...` (paste your anon key)
- Environment: Check all three (Production, Preview, Development)

6. Click **Save** for each

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (...) → **Redeploy**
4. Wait 1-2 minutes for deployment to complete

### Step 4: Test

1. Open your Vercel URL: `https://your-project.vercel.app`
2. Register a new account
3. Login
4. Try chatting - Error should be GONE! ✅

## Still Not Working?

### Check Browser Console
1. Press F12 on your deployed site
2. Look for red errors
3. Check if you see Supabase configuration errors

### Verify Variables in Vercel
Make sure both variables are set:
- ✅ `VITE_SUPABASE_URL` 
- ✅ `VITE_SUPABASE_ANON_KEY`

### Add Vercel Domain to Supabase
1. Go to Supabase → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://your-project.vercel.app`
3. Add to **Redirect URLs**: `https://your-project.vercel.app/**`

## Why This Happens

- Vercel doesn't automatically copy your local `.env` file
- You must manually add environment variables in Vercel dashboard
- After adding variables, you MUST redeploy

## Need More Help?

See the complete guide: **VERCEL_DEPLOYMENT.md**
