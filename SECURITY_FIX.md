# Security Fix: Firebase API Key Exposure

## Problem
Firebase API keys were hardcoded in the source code and committed to GitHub, which is a security risk.

## Solution Implemented

### 1. Environment Variables
Created `.env.local` file to store sensitive configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
... etc
```

### 2. Updated Files
- **`src/lib/firebase.ts`**: Now reads from environment variables
- **`src/app/firebase-setup/page.tsx`**: Shows placeholder values instead of real keys
- **`.env.local.example`**: Template for other developers

### 3. Git Protection
- `.env.local` is already in `.gitignore`
- Will NOT be committed to repository

## Steps to Complete the Fix

### Step 1: Regenerate Firebase API Key (CRITICAL!)
Since the old key is already on GitHub, you MUST regenerate it:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project "sigma2-25a57"
3. Go to **Project Settings** → **General**
4. Scroll to "Your apps" section
5. Click on your web app
6. Click **"Regenerate API Key"** or create a new web app
7. Copy the new configuration

### Step 2: Update .env.local
Replace the values in `Webstore/webstore/.env.local` with your NEW Firebase config.

### Step 3: Remove Exposed Keys from Git History
The old keys are still in Git history. You have two options:

#### Option A: Remove from Git History (Recommended but Complex)
```bash
# Install BFG Repo-Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Remove the exposed keys
bfg --replace-text passwords.txt YOUR_REPO.git

# Force push
cd YOUR_REPO.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

#### Option B: Rotate Keys and Move Forward (Easier)
1. Regenerate ALL Firebase keys (done in Step 1)
2. Update `.env.local` with new keys
3. Commit the changes (without the actual keys)
4. The old keys in history are now useless

### Step 4: Commit the Security Fix
```bash
cd Webstore/webstore

# Add the changes
git add .env.local.example
git add src/lib/firebase.ts
git add src/app/firebase-setup/page.tsx
git add .gitignore

# Commit
git commit -m "security: Move Firebase config to environment variables"

# Push
git push
```

### Step 5: Verify
1. Check that `.env.local` is NOT in your git status
2. Verify the app still works with new keys
3. Confirm GitHub stops sending security alerts

## For Other Developers

When cloning this project:

1. Copy `.env.local.example` to `.env.local`
2. Get Firebase credentials from project admin
3. Fill in the values in `.env.local`
4. Never commit `.env.local`!

## Important Notes

- **`.env.local` is gitignored** - it will never be committed
- **Use `NEXT_PUBLIC_` prefix** for client-side environment variables in Next.js
- **Restart dev server** after changing `.env.local` files
- **Firebase API keys** for web apps are meant to be public but should still be protected from abuse using Firebase Security Rules

## Firebase Security Best Practices

Even with environment variables, secure your Firebase:

1. **Enable App Check** in Firebase Console
2. **Set up Security Rules** for Firestore/Storage
3. **Restrict API key** to specific domains in Google Cloud Console
4. **Monitor usage** in Firebase Console

## What Changed

### Before (❌ Insecure):
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyA2_zAlanwg7r7suuulQSfYkqocn7ZdMMI",
  // ... hardcoded values
};
```

### After (✅ Secure):
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // ... from environment variables
};
```

## Testing

After implementing the fix:

```bash
# Start dev server
npm run dev

# Test Firebase authentication
# Try logging in - it should work with new keys
```

## Troubleshooting

### "Firebase configuration invalid" error
- Check that `.env.local` exists
- Verify all environment variables are set
- Restart the dev server

### Keys still showing in GitHub
- Make sure you committed the changes to `firebase.ts`
- Verify `.env.local` is in `.gitignore`
- Check `git status` - `.env.local` should NOT appear

### App not working after changes
- Verify new Firebase keys are correct
- Check browser console for errors
- Ensure you restarted the dev server
