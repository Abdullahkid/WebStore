# Subdomain System - Terminology Reference

## Three Distinct Fields

Your platform uses **three separate fields** for store identification:

### 1. Business Name (Display Name)
- **Field**: `businessName`
- **Example**: `"Omega"`
- **Purpose**: Display name shown to users
- **Unique**: ❌ No (multiple stores can have same name)
- **Format**: Any characters, spaces allowed
- **Used for**: Branding, display in UI

### 2. Username (Login ID)
- **Field**: `username`
- **Example**: `"omega_store"`
- **Purpose**: Unique identifier for login and internal references
- **Unique**: ✅ Yes (enforced by database)
- **Format**: Can include underscores, alphanumeric
- **Used for**: Authentication, internal API calls

### 3. Subdomain (URL Slug)
- **Field**: `subdomain`
- **Example**: `"omega"`
- **Purpose**: URL-friendly identifier for store access
- **Unique**: ✅ Yes (enforced by database)
- **Format**: Lowercase, alphanumeric, hyphens only (no underscores)
- **Used for**: Public URLs, SEO, branding

## Complete Example

```
Store 1:
├─ businessName: "Omega"
├─ username: "omega_store"
└─ subdomain: "omega"
   └─ URL: https://omega.downxtown.com

Store 2 (same business name):
├─ businessName: "Omega"           ← Same name allowed!
├─ username: "omega_fashion"       ← Different username
└─ subdomain: "omegafashion"       ← Different subdomain
   └─ URL: https://omegafashion.downxtown.com
```

## Flow Diagram

### User Access Flow:
```
User types: omega.downxtown.com
    ↓
Middleware extracts subdomain: "omega"
    ↓
Backend fetches by subdomain: "omega"
    ↓
Returns store with subdomain "omega":
  - businessName: "Omega"
  - username: "omega_store"
  - subdomain: "omega"
    ↓
Render store page showing "Omega"
```

### Login Flow:
```
User logs in with: "omega_store" + password
    ↓
Backend authenticates by username: "omega_store"
    ↓
Returns Business:
  - businessName: "Omega"
  - username: "omega_store"
  - subdomain: "omega"
    ↓
User accesses dashboard
```

## API Endpoints

### Fetch by Subdomain (Public):
```
GET /api/v1/store/by-subdomain/omega
Returns: Store with subdomain "omega"
```

### Fetch by Username (Internal):
```
GET /api/v1/store/by-username/omega_store
Returns: Store with username "omega_store"
```

### Fetch by ID (Internal):
```
GET /api/v1/store/68c0f945731fce6c0fdcb1b5
Returns: Store with that MongoDB ID
```

## When to Use Each Field

### Use `businessName` when:
- Displaying store name in UI
- Showing in search results
- Email communications
- Invoices and receipts

### Use `username` when:
- User is logging in
- Internal API calls
- Admin operations
- Database queries by login ID

### Use `subdomain` when:
- Constructing public URLs
- Routing requests
- SEO optimization
- Sharing store links
- Marketing materials

## URL Structure

### Public Store Access:
```
https://omega.downxtown.com
         ↑
    subdomain field
```

### Not Used in URL:
```
❌ https://omega_store.downxtown.com  (username - has underscore)
❌ https://Omega.downxtown.com        (businessName - has capital)
```

## Database Schema

```kotlin
data class Business(
    val id: String,                    // MongoDB ObjectId
    val businessName: String,          // "Omega" (display)
    val username: String,              // "omega_store" (login)
    val subdomain: String,             // "omega" (URL)
    val email: String,
    val phoneNumber: String,
    // ... other fields
)

// Indexes:
// - username: unique
// - subdomain: unique
// - businessName: not unique
```

## Validation Rules

### Business Name:
- ✅ Any characters
- ✅ Spaces allowed
- ✅ Can be duplicate
- ✅ 1-100 characters

### Username:
- ✅ Alphanumeric + underscores
- ✅ Must be unique
- ✅ 3-30 characters
- ✅ Case-insensitive

### Subdomain:
- ✅ Lowercase only
- ✅ Alphanumeric + hyphens (no underscores)
- ✅ Must be unique
- ✅ 3-30 characters
- ✅ Cannot start/end with hyphen
- ✅ No consecutive hyphens
- ✅ Not in reserved list

## Reserved Subdomains

These cannot be used as subdomains:
```
www, api, admin, app, mail, ftp, smtp, pop, imap,
blog, shop, store, help, support, about, contact,
terms, privacy, login, register, signup, signin,
dashboard, settings, account, profile, checkout, cart
```

## Common Mistakes to Avoid

### ❌ Wrong:
```typescript
// Using username in URL
const url = `https://${username}.downxtown.com`;
// Result: https://omega_store.downxtown.com (invalid - has underscore)

// Using businessName in URL
const url = `https://${businessName}.downxtown.com`;
// Result: https://Omega.downxtown.com (invalid - has capital)
```

### ✅ Correct:
```typescript
// Using subdomain in URL
const url = `https://${subdomain}.downxtown.com`;
// Result: https://omega.downxtown.com (valid!)
```

## Migration Considerations

If you have existing stores without subdomains:

1. **Generate subdomains** from business names
2. **Ensure uniqueness** (add numbers if needed)
3. **Update all links** to use subdomain
4. **Keep backward compatibility** with ID-based URLs
5. **Redirect** old URLs to new subdomain URLs

## Summary

| Field | Example | Unique | URL-Safe | Purpose |
|-------|---------|--------|----------|---------|
| businessName | "Omega" | ❌ No | ❌ No | Display |
| username | "omega_store" | ✅ Yes | ❌ No | Login |
| subdomain | "omega" | ✅ Yes | ✅ Yes | URL |

**Key Takeaway**: Always use `subdomain` for URLs, never `username` or `businessName`.
