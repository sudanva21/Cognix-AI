# 🔧 API Troubleshooting Guide

## Common Errors and Solutions

### 1. 401 Unauthorized Error

**Error Message:**
```
🔑 Authentication Error: Your OpenRouter API key is invalid or expired.
```

**Cause:** Invalid, expired, or missing OpenRouter API key

**Solution:**

#### For Local Development:
1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign in or create an account
3. Click "Create Key" to generate a new API key
4. Copy the key (starts with `sk-or-v1-...`)
5. Open your `.env` file
6. Update or add:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-new-key-here
   ```
7. Restart your dev server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

#### For Production (Vercel):
1. Get your new API key from OpenRouter (steps above)
2. Go to [https://vercel.com](https://vercel.com)
3. Open your project → **Settings** → **Environment Variables**
4. Find `VITE_OPENROUTER_API_KEY`
5. Click **Edit** → Update the value → **Save**
6. Go to **Deployments** → Click (...) → **Redeploy**

---

### 2. 400 Bad Request Error

**Error Message:**
```
⚠️ Bad Request: Invalid request format
```

**Cause:** Malformed API request or invalid model selection

**Solution:**
1. Check if the selected AI model is valid
2. Try switching to a different model in Settings
3. Clear your browser cache
4. If the error persists, check the browser console for details

---

### 3. 402 Payment Required Error

**Error Message:**
```
💳 Payment Required: Your OpenRouter account has insufficient credits.
```

**Cause:** Your OpenRouter account has run out of credits

**Solution:**
1. Go to [https://openrouter.ai/credits](https://openrouter.ai/credits)
2. Add credits to your account
3. Try sending a message again

---

### 4. 429 Rate Limit Error

**Error Message:**
```
⏱️ Rate Limit: Too many requests. Please wait a moment and try again.
```

**Cause:** Too many API requests in a short time

**Solution:**
1. Wait 30-60 seconds before trying again
2. Reduce the frequency of your requests
3. Consider upgrading your OpenRouter plan for higher limits

---

### 5. "User not found" Error

**Error Message:**
```
Sorry, I encountered an error: User not found.
```

**Cause:** Supabase authentication not configured properly

**Solution:**

#### For Local Development:
1. Check your `.env` file has:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
2. Get credentials from [https://app.supabase.com](https://app.supabase.com)
3. Restart your dev server

#### For Production (Vercel):
1. Add Supabase environment variables (see QUICK_FIX.md)
2. Redeploy your application

---

## Checking Your Configuration

### Local Development

1. **Check .env file:**
   ```bash
   # Your .env should have these three variables:
   VITE_OPENROUTER_API_KEY=sk-or-v1-...
   VITE_SUPABASE_URL=https://...supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

2. **Check browser console:**
   - Press F12
   - Look for red errors
   - Check for configuration warnings

3. **Verify API key is loading:**
   - Open browser console
   - Look for any "❌" error messages about configuration

### Production (Vercel)

1. **Check environment variables:**
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify all three variables are set:
     - ✅ `VITE_OPENROUTER_API_KEY`
     - ✅ `VITE_SUPABASE_URL`
     - ✅ `VITE_SUPABASE_ANON_KEY`

2. **Check deployment logs:**
   - Vercel Dashboard → Deployments → Latest deployment
   - Click on the deployment
   - Check "Build Logs" for errors

3. **Test the deployed site:**
   - Open your Vercel URL
   - Press F12 → Console tab
   - Look for configuration errors

---

## Testing Your API Keys

### Test OpenRouter API Key

You can test if your OpenRouter API key works using curl:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -d '{
    "model": "openai/gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

**Expected Response:** JSON with AI response
**Error Response:** 401 = Invalid key, 402 = No credits

### Test Supabase Connection

1. Go to your Supabase project dashboard
2. Check if the project is active (green status)
3. Go to **Authentication** → **Users**
4. Verify you can see registered users

---

## Environment Variables Checklist

Before deploying or running locally, verify:

### Local (.env file):
- [ ] `.env` file exists in project root
- [ ] `.env` is in `.gitignore`
- [ ] `VITE_OPENROUTER_API_KEY` is set
- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] Dev server restarted after changes

### Production (Vercel):
- [ ] `VITE_OPENROUTER_API_KEY` added to Vercel
- [ ] `VITE_SUPABASE_URL` added to Vercel
- [ ] `VITE_SUPABASE_ANON_KEY` added to Vercel
- [ ] All variables set for Production, Preview, Development
- [ ] Project redeployed after adding variables
- [ ] Vercel domain added to Supabase URL Configuration

---

## Quick Fixes

### "Nothing works after deployment"
1. Add all three environment variables to Vercel
2. Redeploy
3. Clear browser cache
4. Try again

### "Works locally but not in production"
1. Environment variables not set in Vercel
2. Add them and redeploy

### "API key invalid" error
1. Generate new key at https://openrouter.ai/keys
2. Update in .env (local) or Vercel (production)
3. Restart/redeploy

### "Out of credits" error
1. Add credits at https://openrouter.ai/credits
2. Or use a different API key

---

## Getting Help

If you're still having issues:

1. **Check browser console** (F12) for specific errors
2. **Check Vercel logs** for deployment errors
3. **Verify API keys** are valid and have credits
4. **Check OpenRouter status** at https://status.openrouter.ai
5. **Check Supabase status** at https://status.supabase.com

## Useful Links

- **OpenRouter Dashboard:** https://openrouter.ai/keys
- **OpenRouter Credits:** https://openrouter.ai/credits
- **OpenRouter Docs:** https://openrouter.ai/docs
- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com
