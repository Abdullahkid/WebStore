# Store Registration Form - Subdomain Selection Mockup

## Registration Form Flow

### Step 1: Basic Information
```
┌─────────────────────────────────────────────────────┐
│  Create Your Store                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Business Name *                                    │
│  ┌───────────────────────────────────────────────┐ │
│  │ Omega                                         │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Username *                                         │
│  ┌───────────────────────────────────────────────┐ │
│  │ omega_store                                   │ │
│  └───────────────────────────────────────────────┘ │
│  This will be your login username                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Step 2: Choose Store URL (Subdomain)
```
┌─────────────────────────────────────────────────────┐
│  Choose Your Store URL *                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────┐                     │
│  │ omega                     │ .downxtown.com      │
│  └───────────────────────────┘                     │
│                                    ✓ Available!     │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ℹ️ Your store will be at:                   │   │
│  │ https://omega.downxtown.com                 │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Rules:                                             │
│  • 3-30 characters                                  │
│  • Lowercase letters, numbers, and hyphens only     │
│  • Cannot start or end with a hyphen                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### If Subdomain is Taken:
```
┌─────────────────────────────────────────────────────┐
│  Choose Your Store URL *                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────┐                     │
│  │ omega                     │ .downxtown.com      │
│  └───────────────────────────┘                     │
│                                    ✗ Already taken  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ⚠️ This subdomain is already taken          │   │
│  │                                             │   │
│  │ Try these available alternatives:           │   │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐     │   │
│  │ │ omega1   │ │omegashop │ │omegastore│     │   │
│  │ └──────────┘ └──────────┘ └──────────┘     │   │
│  │ ┌──────────┐ ┌──────────┐                  │   │
│  │ │omega-hq  │ │omega-off │                  │   │
│  │ └──────────┘ └──────────┘                  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Real-time Checking (As User Types):
```
User types: "o"
  → Too short (minimum 3 characters)

User types: "om"
  → Too short (minimum 3 characters)

User types: "ome"
  → Checking... ⏳

User types: "omeg"
  → Checking... ⏳

User types: "omega"
  → ✓ Available!
  → Preview: https://omega.downxtown.com

User types: "omega_"
  → Invalid character (underscore not allowed)
  → Auto-corrected to: "omega"
```

## Component Features

### 1. Real-time Validation
- ✅ Check as user types (debounced 500ms)
- ✅ Format validation (lowercase, alphanumeric, hyphens)
- ✅ Length validation (3-30 characters)
- ✅ Reserved words check
- ✅ Availability check

### 2. User Feedback
- ✅ Loading spinner while checking
- ✅ Green checkmark if available
- ✅ Red X if taken
- ✅ Error messages
- ✅ Suggestions if taken
- ✅ Live preview of final URL

### 3. Auto-correction
- ✅ Convert to lowercase automatically
- ✅ Remove invalid characters
- ✅ Prevent consecutive hyphens
- ✅ Trim leading/trailing hyphens

## Backend Validation

### Validation Rules:
```kotlin
✓ Length: 3-30 characters
✓ Format: ^[a-z0-9-]+$
✓ No leading/trailing hyphens
✓ No consecutive hyphens
✓ Not in reserved list
✓ Unique in database
```

### Reserved Subdomains:
```
www, api, admin, app, mail, ftp, smtp, pop, imap,
blog, shop, store, help, support, about, contact,
terms, privacy, login, register, signup, signin,
dashboard, settings, account, profile, checkout, cart
```

### API Response Examples:

**Available:**
```json
{
  "available": true,
  "subdomain": "omega",
  "url": "https://omega.downxtown.com"
}
```

**Taken:**
```json
{
  "available": false,
  "error": "This subdomain is already taken",
  "suggestions": [
    "omega1",
    "omegashop",
    "omegastore",
    "omega-hq",
    "omega-official"
  ]
}
```

**Invalid Format:**
```json
{
  "available": false,
  "error": "Only lowercase letters, numbers, and hyphens allowed"
}
```

**Reserved:**
```json
{
  "available": false,
  "error": "This subdomain is reserved"
}
```

## User Experience Flow

### Happy Path:
```
1. User enters business name: "Omega"
2. User enters username: "omega_store"
3. User types subdomain: "omega"
4. System checks → Available ✓
5. User sees preview: "https://omega.downxtown.com"
6. User clicks "Create Store"
7. Store created successfully
8. User can access: omega.downxtown.com
```

### Subdomain Taken Path:
```
1. User types subdomain: "omega"
2. System checks → Already taken ✗
3. System shows suggestions: "omega1", "omegashop", etc.
4. User clicks suggestion: "omegashop"
5. System checks → Available ✓
6. User sees preview: "https://omegashop.downxtown.com"
7. User clicks "Create Store"
8. Store created successfully
```

### Invalid Format Path:
```
1. User types: "Omega_Store"
2. System auto-corrects to: "omegastore"
3. System checks → Available ✓
4. User proceeds
```

## Benefits of User-Chosen Subdomains

✅ **User Control**: Sellers choose their own brand identity
✅ **No Surprises**: They know exactly what URL they'll get
✅ **Better Branding**: Can match their business name perfectly
✅ **Immediate Feedback**: Real-time availability checking
✅ **Suggestions**: Helpful alternatives if first choice is taken
✅ **Validation**: Prevents invalid or problematic subdomains
✅ **Unique**: Enforced uniqueness at registration time

## Implementation Checklist

### Backend:
- [ ] Add `subdomain` field to Business model
- [ ] Create validation function
- [ ] Create availability check endpoint
- [ ] Add reserved words list
- [ ] Generate suggestions algorithm
- [ ] Update registration endpoint to accept subdomain
- [ ] Add unique index on subdomain field

### Frontend:
- [ ] Create SubdomainInput component
- [ ] Implement real-time checking with debounce
- [ ] Add format validation
- [ ] Show availability status
- [ ] Display suggestions
- [ ] Show URL preview
- [ ] Integrate into registration form

### Testing:
- [ ] Test with valid subdomains
- [ ] Test with taken subdomains
- [ ] Test with invalid formats
- [ ] Test with reserved words
- [ ] Test suggestions generation
- [ ] Test real-time checking performance
- [ ] Test with slow network

## Example Registration Data

```json
{
  "businessName": "Omega",
  "username": "omega_store",
  "subdomain": "omega",
  "email": "contact@omega.com",
  "phoneNumber": "+919876543210",
  "password": "securepassword"
}
```

**Result:**
- Store Name: "Omega"
- Login Username: "omega_store"
- Store URL: https://omega.downxtown.com
- Admin Panel: https://omega.downxtown.com/admin (or main site)
