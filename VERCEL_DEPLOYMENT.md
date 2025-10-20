# Vercel Deployment Guide for COGNIX

This guide will help you deploy COGNIX to Vercel and fix the "User not found" error.

## 🚨 Common Issue: "User not found" Error

This error occurs when Supabase environment variables are not set in Vercel. Here's how to fix it:

## 📋 Step-by-Step Deployment

### 1. Prepare Your Project

Make sure your `.env` file is in `.gitignore` (it should be):
```bash
# Check if .env is ignored
git status
```

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **IMPORTANT**: Before clicking "Deploy", add environment variables

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 3. Add Environment Variables in Vercel

This is the **MOST IMPORTANT** step to fix the "User not found" error!

#### In Vercel Dashboard:

1. Go to your project in Vercel
2. Click **Settings** tab
3. Click **Environment Variables** in the sidebar
4. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

**Where to find these values:**
- Go to [https://app.supabase.com](https://app.supabase.com)
- Select your project
- Go to **Settings** → **API**
- Copy **Project URL** and **anon public** key

5. Click **Save**
6. **IMPORTANT**: Redeploy your project after adding variables

### 4. Redeploy After Adding Variables

After adding environment variables, you MUST redeploy:

#### Method 1: Trigger Redeploy in Vercel
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

#### Method 2: Push a New Commit
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

### 5. Configure Supabase for Production

#### Add Vercel Domain to Supabase

1. Go to your Supabase project
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel domain to **Site URL**:
   ```
   https://your-project-name.vercel.app
   ```
4. Add to **Redirect URLs**:
   ```
   https://your-project-name.vercel.app/**
   ```

## 🔧 Troubleshooting

### Error: "User not found"

**Cause**: Supabase environment variables not set in Vercel

**Solution**:
1. ✅ Add `VITE_SUPABASE_URL` to Vercel environment variables
2. ✅ Add `VITE_SUPABASE_ANON_KEY` to Vercel environment variables
3. ✅ Redeploy the project
4. ✅ Clear browser cache and try again

### Error: "Invalid API key"

**Cause**: Wrong Supabase credentials or not using the anon key

**Solution**:
1. Double-check you're using the **anon public** key (not service role key)
2. Verify the Project URL is correct
3. Make sure there are no extra spaces in the environment variables

### Authentication Not Working

**Cause**: Vercel domain not added to Supabase allowed URLs

**Solution**:
1. Go to Supabase → **Authentication** → **URL Configuration**
2. Add your Vercel domain to Site URL and Redirect URLs
3. Format: `https://your-project.vercel.app`

### Environment Variables Not Loading

**Cause**: Variables added after deployment

**Solution**:
1. Always redeploy after adding/changing environment variables
2. Vercel doesn't automatically rebuild when you add variables

## 📝 Deployment Checklist

Before deploying:
- [ ] `.env` file is in `.gitignore`
- [ ] Project builds locally (`npm run build`)
- [ ] All dependencies are in `package.json`

After deploying:
- [ ] Environment variables added in Vercel
- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] Project redeployed after adding variables
- [ ] Vercel domain added to Supabase URL Configuration
- [ ] Test registration and login
- [ ] Test chat functionality

## 🎯 Quick Fix for "User not found" Error

If you're getting this error right now:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add these two variables**:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Redeploy**:
   - Go to Deployments tab
   - Click (...) on latest deployment
   - Click "Redeploy"

4. **Wait for deployment** to complete (1-2 minutes)

5. **Test again** - The error should be gone!

## 🔐 Security Notes

### What to Keep Secret:
- ❌ Never commit `.env` file
- ❌ Never commit Supabase service role key
- ✅ Anon key is safe to use in frontend (it's public)

### Production Best Practices:
1. Enable Row Level Security (RLS) in Supabase
2. Use environment-specific variables
3. Enable email verification for production
4. Set up custom SMTP for emails

## 📊 Vercel Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🌐 Custom Domain (Optional)

To add a custom domain:

1. Go to Vercel → Your Project → **Settings** → **Domains**
2. Add your domain
3. Update DNS records as instructed
4. Add the custom domain to Supabase URL Configuration

## 📱 Testing Your Deployment

After deployment, test these flows:

1. **Registration**:
   - Go to `/register`
   - Create a new account
   - Check if email is sent (if enabled)

2. **Login**:
   - Go to `/login`
   - Sign in with credentials
   - Should redirect to `/chat`

3. **Chat**:
   - Send a message
   - Should get AI response (no "User not found" error)

4. **Logout**:
   - Click logout button
   - Should redirect to `/login`

## 🆘 Still Having Issues?

### Check Vercel Logs:
1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Check **Build Logs** and **Function Logs**
4. Look for errors related to environment variables

### Check Browser Console:
1. Open your deployed site
2. Press F12 to open Developer Tools
3. Check Console tab for errors
4. Look for Supabase-related errors

### Verify Environment Variables:
```bash
# In your Vercel project settings, verify:
VITE_SUPABASE_URL=https://xxxxx.supabase.co  ✅
VITE_SUPABASE_ANON_KEY=eyJhbGc...  ✅
```

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Auth with Vercel](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Need more help?** Check the Vercel or Supabase documentation, or open an issue in your repository.
