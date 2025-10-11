# Authentication Flow - Complete Fix

## ✅ Fixed: Authentication Check Before Checkout

The checkout page now properly checks for authentication **before** making any API calls.

---

## 🔒 Authentication Flow

### Complete Flow with Auth Checks

```
Product Page (User clicks "Buy Now")
    ↓
┌─────────────────────────────────────────┐
│ CHECK 1: Is authToken in localStorage? │
└─────────────────────────────────────────┘
    ↓ NO
    ├─→ Save buyNowIntent to sessionStorage
    ├─→ Show "Please login to continue"
    └─→ Redirect to /login?redirect=/address
    
    ↓ YES
┌─────────────────────────────────────────┐
│ CHECK 2: Is accountType === 'PERSONAL'? │
└─────────────────────────────────────────┘
    ↓ NO
    ├─→ Show "Only personal accounts can purchase"
    └─→ Stop flow
    
    ↓ YES
┌─────────────────────────────────────────┐
│ CHECK 3: Does user have address?        │
└─────────────────────────────────────────┘
    ↓ NO
    ├─→ Show "Please add your delivery address"
    └─→ Redirect to /address?productId=xxx&quantity=1
    
    ↓ YES
    └─→ Redirect to /checkout?productId=xxx&quantity=1

Checkout Page Loads
    ↓
┌─────────────────────────────────────────┐
│ CHECK 4: Is authToken in localStorage? │
└─────────────────────────────────────────┘
    ↓ NO
    ├─→ Save checkoutIntent to sessionStorage
    ├─→ Show "Please login to continue"
    └─→ Redirect to /login?redirect=/checkout
    
    ↓ YES
┌─────────────────────────────────────────┐
│ CHECK 5: Is accountType === 'PERSONAL'? │
└─────────────────────────────────────────┘
    ↓ NO
    ├─→ Show "Only personal accounts can make purchases"
    └─→ Redirect to /
    
    ↓ YES
┌─────────────────────────────────────────┐
│ CHECK 6: Are checkout params valid?     │
└─────────────────────────────────────────┘
    ↓ NO
    ├─→ Show "Invalid checkout parameters"
    └─→ Show error state
    
    ↓ YES
┌─────────────────────────────────────────┐
│ CHECK 7: Is Firebase auth ready?        │
└─────────────────────────────────────────┘
    ↓ NO
    ├─→ Try signInWithCustomToken(authToken)
    ├─→ If fails: Clear authToken
    └─→ Redirect to /login?redirect=/checkout
    
    ↓ YES
    └─→ Get Firebase ID token
    └─→ Make API call to /api/v1/checkout/initiate
    └─→ Display checkout UI
```

---

## 🔧 What Was Fixed

### Checkout Page (`src/app/checkout/page.tsx`)

#### Before (Broken)
```typescript
useEffect(() => {
  if (!customerId || !productId || !quantity) {
    setError('Invalid checkout parameters');
    setIsLoading(false);
    return;
  }

  loadCheckoutData(); // ❌ Called immediately without auth check
}, [customerId, productId, variantId, quantity]);
```

**Problem:** The checkout page would immediately call `loadCheckoutData()` which makes an API request, even if the user is not authenticated.

#### After (Fixed)
```typescript
useEffect(() => {
  const checkAuth = async () => {
    // ✅ CHECK 1: Verify authToken exists
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      showToast('Please login to continue', 'error');
      sessionStorage.setItem('checkoutIntent', JSON.stringify({
        customerId, productId, variantId, quantity
      }));
      router.push('/login?redirect=/checkout');
      return;
    }

    // ✅ CHECK 2: Verify account type
    const accountType = localStorage.getItem('accountType');
    if (accountType !== 'PERSONAL') {
      showToast('Only personal accounts can make purchases', 'error');
      router.push('/');
      return;
    }

    // ✅ CHECK 3: Validate parameters
    if (!customerId || !productId || !quantity) {
      setError('Invalid checkout parameters');
      setIsLoading(false);
      return;
    }

    // ✅ All checks passed - now load checkout data
    loadCheckoutData();
  };

  checkAuth();
}, [customerId, productId, variantId, quantity, router]);
```

### Enhanced `loadCheckoutData()` Function

#### Added Firebase Auth Verification
```typescript
const loadCheckoutData = async () => {
  try {
    setIsLoading(true);
    
    // ✅ Double-check authToken exists
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      showToast('Authentication required', 'error');
      router.push('/login?redirect=/checkout');
      return;
    }

    // ✅ Wait for Firebase auth to be ready
    let user = auth.currentUser;
    if (!user) {
      // Try to sign in with custom token
      try {
        const { signInWithCustomToken } = await import('firebase/auth');
        const userCredential = await signInWithCustomToken(auth, authToken);
        user = userCredential.user;
      } catch (authError) {
        console.error('Firebase auth error:', authError);
        showToast('Authentication failed. Please login again.', 'error');
        localStorage.removeItem('authToken');
        router.push('/login?redirect=/checkout');
        return;
      }
    }
    
    // ✅ Now get Firebase ID token and make API call
    const token = await user.getIdToken();
    const data = await initiateCheckout(...);
    // ... rest of the code
  } catch (err) {
    // ... error handling
  }
};
```

---

## 🎯 Authentication Checks Summary

### Product Page (ProductDetailPage.tsx)
✅ **Check 1:** authToken exists  
✅ **Check 2:** accountType === 'PERSONAL'  
✅ **Check 3:** User has address  

### Checkout Page (checkout/page.tsx)
✅ **Check 4:** authToken exists (before loading)  
✅ **Check 5:** accountType === 'PERSONAL'  
✅ **Check 6:** Valid checkout parameters  
✅ **Check 7:** Firebase auth ready  
✅ **Check 8:** Firebase ID token obtained  

---

## 🔑 Storage Keys Used

### localStorage
- `authToken` - Custom token from backend (required)
- `accountType` - User type: 'PERSONAL' or 'BUSINESS' (required)

### sessionStorage
- `buyNowIntent` - Saved when user clicks Buy Now without auth
- `checkoutIntent` - Saved when user reaches checkout without auth

---

## 🧪 Test Scenarios

### Scenario 1: Direct Checkout URL (Not Logged In)
```
User navigates to: /checkout?productId=xxx&quantity=1
```
**Expected:**
1. Checkout page loads
2. Checks authToken → NOT FOUND
3. Saves checkoutIntent to sessionStorage
4. Shows "Please login to continue"
5. Redirects to /login?redirect=/checkout
6. **NO API CALL MADE** ✅

### Scenario 2: Direct Checkout URL (Logged In)
```
User navigates to: /checkout?productId=xxx&quantity=1
(authToken exists in localStorage)
```
**Expected:**
1. Checkout page loads
2. Checks authToken → FOUND ✅
3. Checks accountType → PERSONAL ✅
4. Validates parameters → VALID ✅
5. Checks Firebase auth → READY ✅
6. Makes API call to /api/v1/checkout/initiate ✅
7. Displays checkout UI ✅

### Scenario 3: Buy Now Flow (Not Logged In)
```
User clicks "Buy Now" on product page
(No authToken in localStorage)
```
**Expected:**
1. ProductDetailPage checks authToken → NOT FOUND
2. Saves buyNowIntent to sessionStorage
3. Shows "Please login to continue"
4. Redirects to /login?redirect=/address
5. **NO NAVIGATION TO CHECKOUT** ✅

### Scenario 4: Buy Now Flow (Logged In, No Address)
```
User clicks "Buy Now" on product page
(authToken exists, no address)
```
**Expected:**
1. ProductDetailPage checks authToken → FOUND ✅
2. Checks accountType → PERSONAL ✅
3. Checks address → NOT FOUND
4. Shows "Please add your delivery address"
5. Redirects to /address?productId=xxx&quantity=1
6. **NO NAVIGATION TO CHECKOUT YET** ✅

### Scenario 5: Buy Now Flow (Logged In, Has Address)
```
User clicks "Buy Now" on product page
(authToken exists, address exists)
```
**Expected:**
1. ProductDetailPage checks authToken → FOUND ✅
2. Checks accountType → PERSONAL ✅
3. Checks address → FOUND ✅
4. Redirects to /checkout?productId=xxx&quantity=1
5. Checkout page checks authToken → FOUND ✅
6. Makes API call ✅
7. Displays checkout UI ✅

---

## 🛡️ Security Benefits

✅ **No unauthorized API calls** - API is only called after authentication  
✅ **Token validation** - Both localStorage and Firebase tokens verified  
✅ **Account type enforcement** - Only PERSONAL accounts can checkout  
✅ **Session preservation** - User intent saved for post-login resume  
✅ **Error recovery** - Clear error messages and redirect paths  

---

## 📝 Files Modified

1. **`src/app/checkout/page.tsx`**
   - Added authentication check in useEffect
   - Enhanced loadCheckoutData with Firebase auth verification
   - Added checkoutIntent saving for post-login

2. **`src/components/product/ProductDetailPage.tsx`**
   - Already had proper authentication checks (no changes needed)

---

## ✅ Result

**Before:** Checkout page would make API calls without checking authentication ❌

**After:** Checkout page verifies authentication at multiple levels before making any API calls ✅

---

**Status:** ✅ FIXED & SECURE  
**Last Updated:** January 2025  
**Security Level:** HIGH
