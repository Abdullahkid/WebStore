# Custom Store Subdomains - Quick Summary

## The Problem
- Store Name: "Omega" (can be duplicate)
- Username: "omega_store" (unique, but has underscore - not URL-friendly)
- Need: Clean URL like `omega.downxtown.com`

## The Solution
Add a **third field**: `subdomain`

```
Store Name: "Omega"           → Display name (can duplicate)
Username: "omega_store"       → Login ID (unique, has underscore)
Subdomain: "omega"            → URL slug (unique, URL-friendly)
```

## Implementation

### 1. Database Schema
```kotlin
data class Business(
    val id: String,
    val businessName: String,    // "Omega"
    val username: String,         // "omega_store"
    val subdomain: String,        // "omega" ← NEW FIELD (user-chosen)
    // ... other fields
)
```

### 2. Backend API
```kotlin
// Check subdomain availability (real-time)
GET /api/v1/store/check-subdomain/{subdomain}

// Returns: { available: true/false, suggestions: [...] }

// Fetch store by subdomain
GET /api/v1/store/by-subdomain/{subdomain}

// Returns store data for: omega.downxtown.com
```

### 3. Frontend: Registration Form
```typescript
// Let user choose subdomain during registration
<SubdomainInput 
  value={subdomain}
  onChange={setSubdomain}
  onValidChange={setIsValid}
/>

// Features:
// - Real-time availability check
// - Format validation
// - Suggestions if taken
// - Preview: "Your store will be at: omega.downxtown.com"
```

### 4. Frontend Middleware
```typescript
// Webstore/webstore/src/middleware.ts
// Detects subdomain and rewrites URL

omega.downxtown.com → /store/omega
```

### 5. Subdomain Selection (User-Driven)
```
Registration Form:
  Business Name: "Omega"
  Username: "omega_store"
  Choose URL: [omega].downxtown.com ← User types this
  
  ✓ Available!
  Your store will be at: https://omega.downxtown.com
```

## Examples

### Store 1:
```
Business Name: "Omega"
Username: "omega_store"
Subdomain: "omega"
URL: https://omega.downxtown.com
```

### Store 2 (same name):
```
Business Name: "Omega"
Username: "omega_fashion"
Subdomain: "omegafashion" or "omega-1"
URL: https://omegafashion.downxtown.com
```

## Flow

```
User visits: omega.downxtown.com
    ↓
Middleware extracts: "omega"
    ↓
Fetch store by subdomain: "omega"
    ↓
Returns store with subdomain "omega"
  (businessName: "Omega", username: "omega_store")
    ↓
Render store page
```

## Key Points

✅ **Subdomain** is separate from username
✅ **Subdomain** is URL-friendly (no underscores)
✅ **Subdomain** is unique (enforced by database)
✅ **Subdomain** is auto-generated from business name
✅ **Username** stays as is (can have underscores)
✅ **Store name** can be duplicate

## DNS Setup

Add wildcard DNS record:
```
Type: A
Name: *
Value: Your server IP
```

This allows: `*.downxtown.com` → Your server

## Testing Locally

Edit hosts file:
```
127.0.0.1 omega.localhost
```

Then visit: `http://omega.localhost:3000`

## Complete Guide

See `SUBDOMAIN_SETUP_GUIDE.md` for full implementation details.
