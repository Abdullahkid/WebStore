# Vercel Deployment Guide for DownXtown Webstore

## Issue Fixed

The `ReferenceError: self is not defined` error has been resolved. This error occurred because Firebase client-side code was being included in the server-side bundle during the build process.

## Changes Made

### 1. Updated `next.config.js`
- Added stronger Firebase exclusion for server bundles
- Aliased `@/lib/firebase` to `false` on server side
- Configured split chunks to keep Firebase only in client bundles
- Externalized all Firebase packages on the server

### 2. Updated `src/lib/firebase.ts`
- Made Firebase initialization strictly client-side only
- Added triple guards (`typeof window !== 'undefined'`) to prevent server execution
- Exported safe client-only auth instance for backward compatibility

### 3. Created `.env.example`
- Template for required environment variables
- Copy this to `.env.local` for local development
- Configure in Vercel dashboard for deployment

## Deployment Steps

### 1. Configure Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_API_BASE_URL=https://downxtown.com
```

### 2. Deploy to Vercel

#### Option A: Via Git (Recommended)
```bash
git add .
git commit -m "Fix Firebase server-side bundling issue"
git push
```

Vercel will automatically detect the push and trigger a new deployment.

#### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### 3. Verify Build Success

After deployment, check:
- Build logs show no `ReferenceError: self is not defined` errors
- All routes are generated successfully
- Firebase authentication works on the deployed site

## Build Verification (Local)

Test the build locally before deploying:

```bash
npm run build
npm run start
```

The build should complete successfully with output showing:
- ✓ Compiled successfully
- ✓ Generating static pages
- No Firebase-related errors

## Important Notes

### Firebase Client-Only Usage
- Firebase code only runs on the client side
- All imports from `@/lib/firebase` will return `undefined` during SSR/build
- Client components must check if `auth` is defined before using it

### Debug Pages
You have several debug/test pages that may not be needed in production:
- `/debug-firebase`
- `/firebase-test`
- `/firebase-compare`
- `/firebase-credential-fix`
- `/firebase-debug`
- `/test-auth`
- `/test-phone-debug`

Consider removing these before production deployment or protecting them with authentication.

### Current Build Stats
```
Route (app)                              Size     First Load JS
┌ ○ /                                    252 B           323 kB
├ ○ /checkout                            13.7 kB         336 kB
├ ○ /login                               8.48 kB         331 kB
├ ○ /register                            12 kB           334 kB
├ ● /store/[slug]                        22.9 kB         345 kB
└ ... (other routes)

First Load JS shared by all              322 kB
├ chunks/vendor-*.js                     318 kB (Firebase excluded from server)
└ chunks/webpack-*.js                    3.76 kB
```

## Troubleshooting

### If build fails on Vercel:
1. Check environment variables are set correctly
2. Ensure all Firebase variables use `NEXT_PUBLIC_` prefix
3. Check build logs for specific errors
4. Verify Node.js version compatibility (use Node 18 or 20)

### If Firebase auth doesn't work after deployment:
1. Check Firebase Console → Authentication → Settings → Authorized domains
2. Add your Vercel domain (e.g., `your-app.vercel.app`)
3. Add any custom domains you're using

### If you see "Firebase not configured" warnings:
- This is expected during SSR/build time
- Firebase will initialize properly on the client side
- Users won't see these warnings in production

## Next Steps

1. Deploy to Vercel with the fixes
2. Test authentication flow on the deployed site
3. Monitor for any Firebase-related errors
4. Consider cleaning up debug/test pages
5. Set up proper error monitoring (e.g., Sentry)

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for Firebase errors
3. Verify environment variables are set
4. Ensure Firebase project has the correct configuration
