# Supabase Setup Guide for COGNIX

This guide will help you set up Supabase authentication for your COGNIX AI Assistant.

## 📋 Prerequisites

- A Supabase account (free tier is fine)
- Your COGNIX project running locally

## 🚀 Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in the details:
   - **Name**: COGNIX (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be created (takes ~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (⚙️) in the sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3. Configure Your Application

1. Create a `.env` file in your project root (if it doesn't exist):
   ```bash
   # In the chatbot folder
   copy .env.example .env
   ```

2. Open the `.env` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Replace the placeholder values with your actual credentials from Step 2

### 4. Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Scroll down to **Email Templates** if you want to customize:
   - Confirmation email
   - Password reset email
   - Magic link email

### 5. Configure Email Settings (Optional but Recommended)

For production, you should set up a custom SMTP server:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your email provider (Gmail, SendGrid, etc.)

For development, Supabase's default email service works fine.

### 6. Set Up Authentication Policies (Optional)

If you want to store user-specific data:

1. Go to **Table Editor** in Supabase
2. Create a `profiles` table (optional):
   ```sql
   create table profiles (
     id uuid references auth.users on delete cascade primary key,
     full_name text,
     avatar_url text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   
   -- Enable Row Level Security
   alter table profiles enable row level security;
   
   -- Create policy to allow users to view their own profile
   create policy "Users can view own profile"
     on profiles for select
     using ( auth.uid() = id );
   
   -- Create policy to allow users to update their own profile
   create policy "Users can update own profile"
     on profiles for update
     using ( auth.uid() = id );
   ```

### 7. Test Your Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test Registration**:
   - Go to `http://localhost:3000/register`
   - Create a new account
   - Check your email for confirmation (if email confirmation is enabled)

3. **Test Login**:
   - Go to `http://localhost:3000/login`
   - Sign in with your credentials
   - You should be redirected to `/chat`

4. **Test Logout**:
   - Click the logout button in the chat interface
   - You should be redirected back to login

## 🔐 Security Best Practices

### Environment Variables

**IMPORTANT**: Never commit your `.env` file to version control!

1. Make sure `.env` is in your `.gitignore`:
   ```
   .env
   .env.local
   ```

2. For production deployment, set environment variables in your hosting platform:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Environment Variables
   - **Railway**: Variables tab

### Row Level Security (RLS)

Always enable RLS on your Supabase tables to protect user data:

```sql
alter table your_table enable row level security;
```

## 🎨 Customization

### Email Templates

Customize the authentication emails in Supabase:

1. Go to **Authentication** → **Email Templates**
2. Edit the templates for:
   - Confirm signup
   - Reset password
   - Magic link

### Redirect URLs

Configure allowed redirect URLs for production:

1. Go to **Authentication** → **URL Configuration**
2. Add your production domain to **Site URL**
3. Add redirect URLs to **Redirect URLs**

## 🐛 Troubleshooting

### "Invalid API key" Error

- Double-check your `.env` file has the correct credentials
- Make sure you're using the **anon public** key, not the service role key
- Restart your development server after changing `.env`

### Email Not Sending

- Check your Supabase project's email rate limits
- For production, set up custom SMTP
- Check spam folder

### "User already registered" Error

- This is normal if you try to register with the same email twice
- Use the login page instead
- Or use the password reset feature

### Authentication Not Persisting

- Check browser console for errors
- Clear browser cache and cookies
- Make sure Supabase URL and key are correct

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## ✅ Checklist

Before going to production:

- [ ] Environment variables set in production hosting
- [ ] Custom SMTP configured
- [ ] Email templates customized
- [ ] Redirect URLs configured
- [ ] Row Level Security enabled on all tables
- [ ] `.env` file added to `.gitignore`
- [ ] Test all auth flows (signup, login, logout, reset password)

---

**Need Help?** Check the [Supabase Discord](https://discord.supabase.com) or [GitHub Discussions](https://github.com/supabase/supabase/discussions)
