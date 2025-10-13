# API Subdomain Update Summary

## Overview
Updated the Webstore project to use `api.downxtown.com` instead of `downxtown.com` for all backend API requests.

## Changes Made

### 1. Environment Configuration
**Files Updated:**
- `.env.local`
- `.env.local.example`

**Changes:**
- Added `NEXT_PUBLIC_API_BASE_URL=https://api.downxtown.com` to both files

### 2. Constants Configuration
**File:** `src/lib/constants.ts`

**Changes:**
- Updated default API base URL from `https://downxtown.com` to `https://api.downxtown.com`
- Changed: `baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.downxtown.com'`

### 3. Checkout API
**File:** `src/lib/api/checkout.ts`

**Changes:**
- Fixed environment variable name from `NEXT_PUBLIC_API_URL` to `NEXT_PUBLIC_API_BASE_URL`
- Updated default URL from `https://downxtown.com` to `https://api.downxtown.com`

### 4. Authentication API Routes
**File:** `src/app/api/auth/firebase-signin/route.ts`

**Changes:**
- Updated hardcoded backend URL to use environment variable
- Changed from: `const backendUrl = 'https://downxtown.com/api/v1/auth/firebase-signin'`
- Changed to: Uses `process.env.NEXT_PUBLIC_API_BASE_URL` with fallback to `https://api.downxtown.com`

### 5. Root Page Update
**File:** `src/app/page.tsx`

**Changes:**
- Removed full marketing landing page (Header, Hero, Features, etc.)
- Replaced with simple informational page explaining subdomain usage
- Directs users to use `[storename].downxtown.com` format

## Domain Structure

The updated configuration supports this domain structure:

```
downxtown.com           → DownXtown-Website (marketing - separate project)
www.downxtown.com       → DownXtown-Website (marketing - separate project)
api.downxtown.com       → Ktor Backend API (VPS)
omega.downxtown.com     → Webstore (Omega's store)
rashid.downxtown.com    → Webstore (Rashid's store)
[anyname].downxtown.com → Webstore (any seller's store)
```

## Testing

### Local Development
For local testing, you can:
1. Use direct routes: `http://localhost:3000/store/omega`
2. Set up hosts file entries for subdomain testing
3. Use services like `nip.io` for subdomain simulation

### Production
All API requests will now go to `api.downxtown.com` instead of `downxtown.com`

## Environment Variables

Make sure to set the following in your deployment environment:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.downxtown.com
```

If not set, the application will fall back to `https://api.downxtown.com` as the default.

## Files That Use API_BASE_URL

1. `src/lib/constants.ts` - Main API configuration
2. `src/lib/api/client.ts` - API client (uses constants)
3. `src/lib/api/checkout.ts` - Checkout API calls
4. `src/app/api/auth/firebase-signin/route.ts` - Firebase authentication

All other API calls inherit from these base configurations.

## Next Steps

1. Deploy the Webstore to handle subdomain routing
2. Configure DNS to point `api.downxtown.com` to your VPS
3. Configure DNS wildcard `*.downxtown.com` to point to Webstore deployment
4. Deploy DownXtown-Website separately for the root domain
5. Test all API endpoints with the new subdomain structure
