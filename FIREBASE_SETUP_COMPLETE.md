# Firebase Setup - Complete Guide

## ✅ Current Status

### What's Working:
1. ✅ Firebase is properly configured to use environment variables
2. ✅ No hardcoded API keys in the code
3. ✅ `.env.local` is gitignored (won't be committed)
4. ✅ Setup instructions page is complete and accurate
5. ✅ Firebase Auth is initialized correctly

### What You Need to Do:

## 🚨 CRITICAL: Regenerate API Keys

Since your API keys were exposed on GitHub, you MUST regenerate them:

### Step 1: Regenerate Firebase Keys
1. Go to https://console.firebase.google.com/
2. Select "sigma2-25a57" project
3. Go to **Project Settings** → **General**
4. Under "Your apps" → Find your web app
5. Click the settings icon → **Regenerate API Key**
6. Copy the NEW configuration

### Step 2: Update .env.local
Replace the values in `Webstore/webstore/.env.local` with your NEW keys:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_new_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sigma2-25a57.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sigma2-25a57
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sigma2-25a57.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=145044904314
NEXT_PUBLIC_FIREBASE_APP_ID=your_new_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 3: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
# Start it again
npm run dev
```

### Step 4: Test
1. Go to http://localhost:3000/test-auth
2. Try phone authentication
3. Should work with real SMS now

## 📁 File Structure

```
Webstore/webstore/
├── .env.local              # Your actual Firebase keys (NOT in git)
├── .env.local.example      # Template for other developers
├── src/
│   ├── lib/
│   │   └── firebase.ts     # Firebase initialization (reads from .env.local)
│   └── app/
│       └── firebase-setup/
│           └── page.tsx    # Setup instructions page
└── .gitignore              # Includes .env* to prevent committing secrets
```

## 🔒 Security

### What's Protected:
- ✅ `.env.local` is in `.gitignore`
- ✅ No hardcoded secrets in code
- ✅ Environment variables are used throughout

### What You Should Do:
1. ✅ Regenerate the exposed API keys
2. ✅ Never commit `.env.local` to git
3. ✅ Use `.env.local.example` to share structure (not values)
4. ✅ Set up Firebase Security Rules
5. ✅ Enable App Check in Firebase Console

## 📖 For Other Developers

When someone else clones your project:

1. Copy `.env.local.example` to `.env.local`
2. Get Firebase credentials from project admin
3. Fill in the values
4. Run `npm run dev`

## 🧪 Testing

### Current Mode:
Your app currently has the OLD (exposed) keys in `.env.local`. It will work, but you should regenerate them.

### After Regenerating:
1. Update `.env.local` with new keys
2. Restart dev server
3. Test at `/test-auth`
4. Real SMS should be sent

## 📝 Setup Instructions Page

Visit http://localhost:3000/firebase-setup for complete step-by-step instructions.

The page will show:
- Your current Firebase configuration (from `.env.local`)
- Step-by-step setup guide
- Testing instructions

## ✅ Verification Checklist

Before committing to GitHub:
- [ ] `.env.local` is NOT in `git status`
- [ ] `src/lib/firebase.ts` has no hardcoded keys
- [ ] `src/app/firebase-setup/page.tsx` has no hardcoded keys
- [ ] Firebase keys have been regenerated
- [ ] App works with new keys

## 🚀 Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables in the hosting platform's dashboard
2. Use the same variable names (NEXT_PUBLIC_FIREBASE_*)
3. Use production Firebase keys (not the same as development)

### Vercel Example:
```
Settings → Environment Variables → Add:
NEXT_PUBLIC_FIREBASE_API_KEY = your_production_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_domain
... etc
```

## 🆘 Troubleshooting

### "Firebase configuration invalid" error
- Check that `.env.local` exists
- Verify all variables are set
- Restart dev server

### Keys still showing in GitHub
- Make sure you committed the updated files
- Verify `.env.local` is in `.gitignore`
- Check `git status` - `.env.local` should NOT appear

### App not working after changes
- Verify new Firebase keys are correct
- Check browser console for errors
- Ensure dev server was restarted

## 📞 Support

If you need help:
1. Check the setup page: http://localhost:3000/firebase-setup
2. Review Firebase Console for any errors
3. Check browser console for detailed error messages
