# Custom Store Subdomains Setup Guide

## Goal
Transform store URLs from:
- ❌ `downxtown.com/store/68c0f945731fce6c0fdcb1b5`

To:
- ✅ `omega.downxtown.com`

## Architecture Overview

```
User visits: omega.downxtown.com
    ↓
Next.js Middleware extracts subdomain: "omega"
    ↓
Fetch store data by subdomain: "omega"
    ↓
Returns store with subdomain "omega"
  (businessName: "Omega", username: "omega_store")
    ↓
Render store page with store data
```

## Implementation Steps

### Step 1: Update Database Schema

Add a **`subdomain`** field to your Business/Store collection in MongoDB:

```kotlin
// In sigma-ktor backend
data class Business(
    val id: String,
    val businessName: String,        // "Omega" (can be duplicate)
    val username: String,             // "omega_store" (unique, but not URL-friendly)
    val subdomain: String,            // ← Add this: "omega" or "omegastore" (unique, URL-safe)
    val customDomain: String? = null, // ← Optional: for custom domains
    // ... other fields
)
```

**Rules for subdomain:**
- **Unique** across all stores (enforced by database)
- **Lowercase only**
- **Alphanumeric + hyphens** (no underscores, no spaces)
- **3-30 characters**
- **Reserved words blocked**: `www`, `api`, `admin`, `app`, `mail`, etc.
- Examples: `omega`, `omegastore`, `tech-store`, `fashion-hub`

**Relationship:**
```
Store Name: "Omega"           → Display name (can duplicate)
Username: "omega_store"       → Login/unique ID (has underscore)
Subdomain: "omega"            → URL slug (omega.downxtown.com)
```

**Example Stores:**
```
Store 1:
  businessName: "Omega"
  username: "omega_store"
  subdomain: "omega"
  URL: omega.downxtown.com

Store 2:
  businessName: "Omega"         ← Same name allowed!
  username: "omega_fashion"
  subdomain: "omegafashion"
  URL: omegafashion.downxtown.com
```

### Step 2: Backend API Endpoint

Create an endpoint to fetch store by subdomain:

```kotlin
// In sigma-ktor: src/main/kotlin/com/example/routing/StoreRoutes.kt

// Existing: GET /api/v1/store/{businessId}
// Add new: GET /api/v1/store/by-subdomain/{subdomain}

get("/api/v1/store/by-subdomain/{subdomain}") {
    val subdomain = call.parameters["subdomain"]?.lowercase()
    
    if (subdomain == null) {
        call.respond(HttpStatusCode.BadRequest, "Subdomain is required")
        return@get
    }
    
    // Validate subdomain format
    if (!subdomain.matches(Regex("^[a-z0-9-]{3,30}$"))) {
        call.respond(HttpStatusCode.BadRequest, "Invalid subdomain format")
        return@get
    }
    
    // Find business by subdomain
    val business = businessCollection.findOne(
        Business::subdomain eq subdomain
    )
    
    if (business == null) {
        call.respond(HttpStatusCode.NotFound, "Store not found")
        return@get
    }
    
    // Return store profile data (same as existing endpoint)
    val storeProfile = getStoreProfile(business.id)
    call.respond(HttpStatusCode.OK, storeProfile)
}

// Also add endpoint to check subdomain availability
get("/api/v1/store/check-subdomain/{subdomain}") {
    val subdomain = call.parameters["subdomain"]?.lowercase()
    
    if (subdomain == null) {
        call.respond(HttpStatusCode.BadRequest, "Subdomain is required")
        return@get
    }
    
    // Check if subdomain is reserved
    val reservedSubdomains = listOf(
        "www", "api", "admin", "app", "mail", "ftp", 
        "smtp", "pop", "imap", "blog", "shop", "store"
    )
    
    if (subdomain in reservedSubdomains) {
        call.respond(mapOf(
            "available" to false,
            "reason" to "This subdomain is reserved"
        ))
        return@get
    }
    
    // Check if subdomain exists
    val exists = businessCollection.findOne(
        Business::subdomain eq subdomain
    ) != null
    
    call.respond(mapOf(
        "available" to !exists,
        "subdomain" to subdomain
    ))
}
```

### Step 3: Next.js Middleware for Subdomain Detection

Create middleware to detect and handle subdomains:

```typescript
// Webstore/webstore/src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain
  // hostname examples: 
  // - "omega.downxtown.com" → subdomain: "omega"
  // - "localhost:3000" → subdomain: null
  // - "downxtown.com" → subdomain: null
  
  const subdomain = getSubdomain(hostname);
  
  // If subdomain exists and it's not 'www', treat it as a store
  if (subdomain && subdomain !== 'www') {
    // Rewrite to store page with subdomain as parameter
    url.pathname = \`/store/\${subdomain}\`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

function getSubdomain(hostname: string): string | null {
  // Remove port if present (for localhost:3000)
  const host = hostname.split(':')[0];
  
  // Split by dots
  const parts = host.split('.');
  
  // For localhost or IP addresses, no subdomain
  if (parts.length < 2 || host === 'localhost') {
    return null;
  }
  
  // For production: omega.downxtown.com → ["omega", "downxtown", "com"]
  // Return first part if there are 3+ parts
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
```

### Step 4: Update Store Page to Handle Subdomains

Modify your store page to accept subdomain instead of just ID:

```typescript
// Webstore/webstore/src/app/store/[identifier]/page.tsx

import { notFound } from 'next/navigation';

interface StorePageProps {
  params: {
    identifier: string; // Can be: businessId, subdomain, or username
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { identifier } = params;
  
  // Determine what type of identifier this is
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const isSubdomain = /^[a-z0-9-]{3,30}$/.test(identifier); // URL-friendly
  const isUsername = identifier.includes('_'); // Has underscore
  
  let storeData;
  
  try {
    if (isMongoId) {
      // Fetch by ID (existing logic)
      storeData = await fetchStoreById(identifier);
    } else if (isSubdomain) {
      // Fetch by subdomain (new logic - most common)
      storeData = await fetchStoreBySubdomain(identifier);
    } else if (isUsername) {
      // Fetch by username (fallback)
      storeData = await fetchStoreByUsername(identifier);
    } else {
      notFound();
    }
  } catch (error) {
    notFound();
  }
  
  if (!storeData) {
    notFound();
  }
  
  return (
    <div>
      {/* Render store page */}
      <h1>{storeData.businessName}</h1>
      <p>@{storeData.username}</p>
      {/* ... rest of store UI */}
    </div>
  );
}

async function fetchStoreById(businessId: string) {
  const response = await fetch(
    \`https://downxtown.com/api/v1/store/\${businessId}\`,
    { cache: 'no-store' }
  );
  
  if (!response.ok) return null;
  return response.json();
}

async function fetchStoreBySubdomain(subdomain: string) {
  const response = await fetch(
    \`https://downxtown.com/api/v1/store/by-subdomain/\${subdomain}\`,
    { cache: 'no-store' }
  );
  
  if (!response.ok) return null;
  return response.json();
}

async function fetchStoreByUsername(username: string) {
  const response = await fetch(
    \`https://downxtown.com/api/v1/store/by-username/\${username}\`,
    { cache: 'no-store' }
  );
  
  if (!response.ok) return null;
  return response.json();
}
```

### Step 5: DNS Configuration

#### For Development (localhost):

You can't use real subdomains on localhost, but you can simulate it:

**Option A: Edit hosts file**
```bash
# Windows: C:\Windows\System32\drivers\etc\hosts
# Mac/Linux: /etc/hosts

127.0.0.1 omega.localhost
127.0.0.1 techstore.localhost
```

Then access: `http://omega.localhost:3000`

**Option B: Use a service like ngrok**
```bash
ngrok http 3000
# Gives you: https://abc123.ngrok.io
# Can test with: https://omega-abc123.ngrok.io
```

#### For Production:

**1. Add Wildcard DNS Record:**

In your DNS provider (Cloudflare, GoDaddy, etc.):
```
Type: A
Name: *
Value: Your server IP (e.g., 123.45.67.89)
TTL: Auto
```

This allows `*.downxtown.com` to point to your server.

**2. Configure Vercel/Netlify (if using):**

**Vercel:**
```bash
# In Vercel dashboard:
# Settings → Domains → Add Domain
# Add: *.downxtown.com
```

**Netlify:**
```bash
# In Netlify dashboard:
# Domain settings → Add domain alias
# Add: *.downxtown.com
```

### Step 6: Update Links Throughout App

Update all store links to use subdomain instead of ID:

```typescript
// Before:
<Link href={\`/store/\${businessId}\`}>Visit Store</Link>

// After (use subdomain, not username):
<Link href={\`https://\${subdomain}.downxtown.com\`}>Visit Store</Link>

// Or for relative links:
<Link href={\`/store/\${subdomain}\`}>Visit Store</Link>

// Example with actual data:
// businessName: "Omega"
// username: "omega_store"
// subdomain: "omega"
<Link href={\`https://omega.downxtown.com\`}>Visit Omega</Link>
```

### Step 7: SEO & Metadata

Update metadata for each store subdomain:

```typescript
// In store/[identifier]/page.tsx

export async function generateMetadata({ params }: StorePageProps) {
  const store = await fetchStore(params.identifier);
  
  return {
    title: \`\${store.businessName} - DownXtown\`,
    description: store.description,
    openGraph: {
      title: store.businessName,
      description: store.description,
      url: \`https://\${store.username}.downxtown.com\`,
      images: [store.logo],
    },
  };
}
```

## Testing

### Local Testing:

1. **Edit hosts file:**
   ```
   127.0.0.1 omega.localhost
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Visit:**
   ```
   http://omega.localhost:3000
   ```

### Production Testing:

1. **Deploy to Vercel/Netlify**
2. **Add wildcard domain:** `*.downxtown.com`
3. **Visit:** `https://omega.downxtown.com`

## Subdomain Selection & Management

### Let Sellers Choose Their Subdomain

**Best Approach**: Ask sellers to choose their subdomain during registration, with real-time availability checking.

### Registration Form Flow:

```
Step 1: Business Name
  Input: "Omega"

Step 2: Choose Your Store URL
  Input: [omega].downxtown.com
  
  Features:
  - Real-time availability check as user types
  - Show suggestions if taken
  - Validate format (lowercase, alphanumeric, hyphens only)
  - Show preview: "Your store will be at: omega.downxtown.com"
```

### Backend: Subdomain Validation & Checking

```kotlin
// In sigma-ktor: Subdomain validation utilities

fun validateSubdomain(subdomain: String): SubdomainValidationResult {
    val cleaned = subdomain.lowercase().trim()
    
    // Check length
    if (cleaned.length < 3) {
        return SubdomainValidationResult(
            valid = false,
            error = "Subdomain must be at least 3 characters"
        )
    }
    
    if (cleaned.length > 30) {
        return SubdomainValidationResult(
            valid = false,
            error = "Subdomain must be less than 30 characters"
        )
    }
    
    // Check format (only lowercase letters, numbers, and hyphens)
    if (!cleaned.matches(Regex("^[a-z0-9-]+$"))) {
        return SubdomainValidationResult(
            valid = false,
            error = "Only lowercase letters, numbers, and hyphens allowed"
        )
    }
    
    // Can't start or end with hyphen
    if (cleaned.startsWith("-") || cleaned.endsWith("-")) {
        return SubdomainValidationResult(
            valid = false,
            error = "Cannot start or end with a hyphen"
        )
    }
    
    // Can't have consecutive hyphens
    if (cleaned.contains("--")) {
        return SubdomainValidationResult(
            valid = false,
            error = "Cannot have consecutive hyphens"
        )
    }
    
    // Check reserved words
    val reserved = listOf(
        "www", "api", "admin", "app", "mail", "ftp", "smtp", "pop", "imap",
        "blog", "shop", "store", "help", "support", "about", "contact",
        "terms", "privacy", "login", "register", "signup", "signin",
        "dashboard", "settings", "account", "profile", "checkout", "cart"
    )
    
    if (cleaned in reserved) {
        return SubdomainValidationResult(
            valid = false,
            error = "This subdomain is reserved"
        )
    }
    
    return SubdomainValidationResult(valid = true)
}

data class SubdomainValidationResult(
    val valid: Boolean,
    val error: String? = null
)

// Real-time availability check endpoint
get("/api/v1/store/check-subdomain/{subdomain}") {
    val subdomain = call.parameters["subdomain"]?.lowercase()?.trim()
    
    if (subdomain == null) {
        call.respond(HttpStatusCode.BadRequest, mapOf(
            "available" to false,
            "error" to "Subdomain is required"
        ))
        return@get
    }
    
    // Validate format
    val validation = validateSubdomain(subdomain)
    if (!validation.valid) {
        call.respond(HttpStatusCode.OK, mapOf(
            "available" to false,
            "error" to validation.error
        ))
        return@get
    }
    
    // Check if already taken
    val exists = businessCollection.findOne(
        Business::subdomain eq subdomain
    ) != null
    
    if (exists) {
        // Suggest alternatives
        val suggestions = generateSubdomainSuggestions(subdomain)
        
        call.respond(HttpStatusCode.OK, mapOf(
            "available" to false,
            "error" to "This subdomain is already taken",
            "suggestions" to suggestions
        ))
    } else {
        call.respond(HttpStatusCode.OK, mapOf(
            "available" to true,
            "subdomain" to subdomain,
            "url" to "https://\${subdomain}.downxtown.com"
        ))
    }
}

fun generateSubdomainSuggestions(subdomain: String): List<String> {
    val suggestions = mutableListOf<String>()
    
    // Try with numbers
    for (i in 1..5) {
        val suggestion = "\${subdomain}\${i}"
        if (!isSubdomainTaken(suggestion)) {
            suggestions.add(suggestion)
        }
    }
    
    // Try with "shop", "store", "official"
    val suffixes = listOf("shop", "store", "official", "hq")
    for (suffix in suffixes) {
        val suggestion = "\${subdomain}-\${suffix}"
        if (!isSubdomainTaken(suggestion)) {
            suggestions.add(suggestion)
        }
    }
    
    return suggestions.take(5)
}

fun isSubdomainTaken(subdomain: String): Boolean {
    return businessCollection.findOne(Business::subdomain eq subdomain) != null
}
```

### Frontend: Registration Form with Real-time Check

```typescript
// Webstore/webstore/src/components/registration/SubdomainInput.tsx

'use client';

import { useState, useEffect } from 'react';
import { Check, X, Loader2 } from 'lucide-react';

interface SubdomainInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange: (isValid: boolean) => void;
}

export function SubdomainInput({ value, onChange, onValidChange }: SubdomainInputProps) {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Debounced availability check
  useEffect(() => {
    if (!value || value.length < 3) {
      setAvailable(null);
      setError(null);
      onValidChange(false);
      return;
    }

    const timer = setTimeout(async () => {
      await checkAvailability(value);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [value]);

  const checkAvailability = async (subdomain: string) => {
    setChecking(true);
    setError(null);
    setSuggestions([]);

    try {
      const response = await fetch(
        \`https://downxtown.com/api/v1/store/check-subdomain/\${subdomain}\`
      );
      const data = await response.json();

      setAvailable(data.available);
      setError(data.error || null);
      setSuggestions(data.suggestions || []);
      onValidChange(data.available);
    } catch (err) {
      setError('Failed to check availability');
      onValidChange(false);
    } finally {
      setChecking(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow lowercase, numbers, and hyphens
    const cleaned = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 30);
    onChange(cleaned);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        Choose Your Store URL <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="your-store-name"
            className={\`w-full px-4 py-3 border-2 rounded-xl text-base transition-all pr-10 \${
              available === true
                ? 'border-green-500 focus:border-green-500'
                : available === false
                ? 'border-red-500 focus:border-red-500'
                : 'border-slate-200 focus:border-[#00BCD4]'
            } focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20\`}
          />
          
          {/* Status Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {checking && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
            {!checking && available === true && (
              <Check className="w-5 h-5 text-green-500" />
            )}
            {!checking && available === false && (
              <X className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>

        <span className="text-slate-600 font-medium">.downxtown.com</span>
      </div>

      {/* Preview */}
      {value && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Your store will be at:</span>{' '}
            <span className="font-bold">https://{value}.downxtown.com</span>
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-700 font-medium mb-2">
            Try these available alternatives:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onChange(suggestion)}
                className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:border-[#00BCD4] hover:text-[#00BCD4] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Format Rules */}
      <div className="text-xs text-slate-500 space-y-1">
        <p>• 3-30 characters</p>
        <p>• Lowercase letters, numbers, and hyphens only</p>
        <p>• Cannot start or end with a hyphen</p>
      </div>
    </div>
  );
}
```

### Store Registration Flow:

```kotlin
// When creating a new business

post("/business/register") {
    val request = call.receive<BusinessRegistrationRequest>()
    
    // Validate subdomain
    val validation = validateSubdomain(request.subdomain)
    if (!validation.valid) {
        call.respond(HttpStatusCode.BadRequest, mapOf(
            "success" to false,
            "error" to validation.error
        ))
        return@post
    }
    
    // Check if subdomain is taken
    if (isSubdomainTaken(request.subdomain)) {
        call.respond(HttpStatusCode.Conflict, mapOf(
            "success" to false,
            "error" to "Subdomain already taken"
        ))
        return@post
    }
    
    // Create business
    val business = Business(
        id = ObjectId().toString(),
        businessName = request.businessName,
        username = request.username,
        subdomain = request.subdomain,  // ← User-chosen
        // ... other fields
    )
    
    businessCollection.insertOne(business)
    
    call.respond(HttpStatusCode.Created, mapOf(
        "success" to true,
        "businessId" to business.id,
        "subdomain" to request.subdomain,
        "url" to "https://\${request.subdomain}.downxtown.com"
    ))
}
```

### Allow Users to Update Subdomain Later:

```kotlin
// Endpoint to update subdomain (one-time or limited changes)

put("/business/{businessId}/subdomain") {
    val businessId = call.parameters["businessId"]
    val newSubdomain = call.receive<SubdomainUpdateRequest>().subdomain.lowercase()
    
    // Validate format
    val validation = validateSubdomain(newSubdomain)
    if (!validation.valid) {
        call.respond(HttpStatusCode.BadRequest, mapOf(
            "success" to false,
            "error" to validation.error
        ))
        return@put
    }
    
    // Check availability
    if (isSubdomainTaken(newSubdomain)) {
        call.respond(HttpStatusCode.Conflict, mapOf(
            "success" to false,
            "error" to "Subdomain already taken"
        ))
        return@put
    }
    
    // Optional: Check if user has already changed subdomain before
    // (to prevent abuse)
    val business = businessCollection.findOne(Business::id eq businessId)
    if (business?.subdomainChangedAt != null) {
        call.respond(HttpStatusCode.Forbidden, mapOf(
            "success" to false,
            "error" to "Subdomain can only be changed once"
        ))
        return@put
    }
    
    // Update
    businessCollection.updateOne(
        Business::id eq businessId,
        combine(
            setValue(Business::subdomain, newSubdomain),
            setValue(Business::subdomainChangedAt, System.currentTimeMillis())
        )
    )
    
    call.respond(HttpStatusCode.OK, mapOf(
        "success" to true,
        "subdomain" to newSubdomain,
        "url" to "https://\${newSubdomain}.downxtown.com"
    ))
}
```

## Database Migration

Add subdomain to existing stores:

```kotlin
// Migration script in sigma-ktor

fun migrateStoreSubdomains() {
    val businesses = businessCollection.find().toList()
    
    businesses.forEach { business ->
        // Generate subdomain from business name
        val subdomain = generateSubdomain(
            businessName = business.businessName,
            username = business.username
        )
        
        // Update business with subdomain
        businessCollection.updateOne(
            Business::id eq business.id,
            setValue(Business::subdomain, subdomain)
        )
        
        println("Migrated: \${business.businessName} → \${subdomain}")
    }
}

// Example output:
// Migrated: Omega → omega
// Migrated: Omega → omega-1 (duplicate name)
// Migrated: Tech Store → tech-store
// Migrated: Fashion & Style → fashion-style
```

## URL Structure Comparison

### Before:
```
Main site: downxtown.com
Store: downxtown.com/store/68c0f945731fce6c0fdcb1b5
Product: downxtown.com/product/abc123
```

### After:
```
Main site: downxtown.com
Store: omega.downxtown.com (subdomain: "omega")
Product: omega.downxtown.com/product/abc123

Note: 
- Store Name: "Omega" (display name)
- Username: "omega_store" (login ID)
- Subdomain: "omega" (URL slug)
```

### Multiple Stores with Same Name:
```
Store 1:
  Name: "Omega"
  Username: "omega_store"
  Subdomain: "omega"
  URL: omega.downxtown.com

Store 2:
  Name: "Omega" (same name!)
  Username: "omega_fashion"
  Subdomain: "omegafashion" or "omega-1"
  URL: omegafashion.downxtown.com
```

## Benefits

✅ **Professional URLs**: `omega.downxtown.com` vs `/store/68c0f945...`
✅ **Better SEO**: Each store gets its own subdomain
✅ **Branding**: Stores feel more independent
✅ **Easy to remember**: Users can bookmark `omega.downxtown.com`
✅ **Custom domains**: Later can add `www.omega.com` → `omega.downxtown.com`

## Advanced: Custom Domains

Allow stores to use their own domains:

```typescript
// Store can use: www.omegastore.com
// Which points to: omega.downxtown.com

// In middleware.ts:
if (hostname === 'www.omegastore.com') {
  // Fetch store by custom domain
  const store = await fetchStoreByCustomDomain(hostname);
  url.pathname = \`/store/\${store.username}\`;
  return NextResponse.rewrite(url);
}
```

## Security Considerations

1. **Validate usernames**: Only allow safe characters
2. **Reserve keywords**: Don't allow `www`, `api`, `admin`, etc.
3. **Rate limiting**: Prevent subdomain enumeration
4. **SSL certificates**: Ensure wildcard SSL covers `*.downxtown.com`

## Troubleshooting

### Subdomain not working locally:
- Check hosts file is saved correctly
- Clear browser cache
- Try different browser
- Ensure middleware is running

### Subdomain not working in production:
- Verify DNS wildcard record is set
- Check Vercel/Netlify domain configuration
- Wait for DNS propagation (up to 48 hours)
- Check SSL certificate covers wildcard

### Store not found:
- Verify username exists in database
- Check API endpoint is working
- Verify middleware is extracting subdomain correctly

## Next Steps

1. ✅ Add `username` field to Business model
2. ✅ Create backend endpoint for username lookup
3. ✅ Implement Next.js middleware
4. ✅ Update store page to handle usernames
5. ✅ Configure DNS wildcard
6. ✅ Test locally with hosts file
7. ✅ Deploy and test in production
8. ✅ Update all store links in the app

## Example Implementation Timeline

- **Day 1**: Backend changes (add username field, API endpoint)
- **Day 2**: Frontend changes (middleware, store page updates)
- **Day 3**: DNS configuration and testing
- **Day 4**: Migration of existing stores
- **Day 5**: Update all links and deploy

## Resources

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Vercel Wildcard Domains](https://vercel.com/docs/concepts/projects/domains/wildcard-domains)
- [DNS Wildcard Records](https://en.wikipedia.org/wiki/Wildcard_DNS_record)
