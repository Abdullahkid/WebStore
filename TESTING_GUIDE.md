# Testing Guide: Ordering Flow

## Quick Test Checklist

### ✅ Test 1: New User Flow (Not Logged In)
**Steps**:
1. Clear browser data (localStorage, sessionStorage, IndexedDB)
2. Open a product page: `http://localhost:3000/product/[productId]`
3. Select variant (if applicable)
4. Click "Buy Now"
5. **Expected**: Redirect to `/login`
6. **Check**: sessionStorage should have `buyNowIntent` with product details
7. Login with personal account credentials
8. **Expected**: After login, check if user has address
9. **If no address**: Redirect to `/address`
10. Add address and submit
11. **Expected**: Redirect to `/checkout` with product details from intent

**What to Verify**:
- [ ] buyNowIntent saved in sessionStorage
- [ ] Login successful
- [ ] User data saved in IndexedDB (check DevTools → Application → IndexedDB → DownxtownUserDB)
- [ ] Address saved in IndexedDB
- [ ] Redirected to checkout with correct product params
- [ ] Intent cleared from sessionStorage

---

### ✅ Test 2: Returning User with Address
**Steps**:
1. Login first (if not already logged in)
2. Verify address exists in IndexedDB
3. Open a product page
4. Select variant (if applicable)
5. Click "Buy Now"
6. **Expected**: Direct redirect to `/checkout` with product details

**What to Verify**:
- [ ] No redirect to login
- [ ] No redirect to address page
- [ ] Direct checkout access
- [ ] Product details passed correctly

---

### ✅ Test 3: Returning User without Address
**Steps**:
1. Login with account that has no address
2. Open a product page
3. Click "Buy Now"
4. **Expected**: Redirect to `/address`
5. **Check**: sessionStorage should have `checkoutIntent`
6. Add address and submit
7. **Expected**: Redirect to `/checkout` with product details

**What to Verify**:
- [ ] checkoutIntent saved in sessionStorage
- [ ] Address form displayed
- [ ] Address saved successfully
- [ ] Redirected to checkout
- [ ] Intent cleared

---

### ✅ Test 4: Business Account Cannot Buy
**Steps**:
1. Login with business account
2. Open a product page
3. Click "Buy Now"
4. **Expected**: Error toast "Only personal accounts can purchase products"
5. **Expected**: No redirect

**What to Verify**:
- [ ] Error message displayed
- [ ] No checkout access
- [ ] User stays on product page

---

### ✅ Test 5: Variant Selection Validation
**Steps**:
1. Open a product with variants
2. Don't select all variant options
3. Click "Buy Now"
4. **Expected**: Error toast "Please select all product options"

**What to Verify**:
- [ ] Error message displayed
- [ ] No redirect
- [ ] User can select variants and try again

---

### ✅ Test 6: Data Persistence
**Steps**:
1. Login successfully
2. Open DevTools → Application → Storage
3. Check localStorage:
   - [ ] `authToken` exists
   - [ ] `accountType` = "PERSONAL"
   - [ ] `userId` exists
4. Check IndexedDB → DownxtownUserDB:
   - [ ] `personal_users` table has user data
   - [ ] `addresses` table has address (if added)
   - [ ] `auth_info` table has tokens
5. Refresh the page
6. **Expected**: User still logged in, data persists

---

### ✅ Test 7: Logout Clears Data
**Steps**:
1. Login and verify data in storage
2. Logout (if logout button exists, or call `authService.logout()` in console)
3. Check localStorage: Should be empty
4. Check IndexedDB: All tables should be empty
5. Try to access checkout
6. **Expected**: Redirect to login

---

### ✅ Test 8: Intent Restoration After Login
**Steps**:
1. Logout (clear all data)
2. Open product page
3. Click "Buy Now"
4. **Check**: `buyNowIntent` in sessionStorage
5. Login
6. **Expected**: After login, automatically continue to address or checkout
7. **Check**: Intent cleared after use

---

## Debugging Tools

### Check localStorage
```javascript
// In browser console
console.log('Auth Token:', localStorage.getItem('authToken'));
console.log('Account Type:', localStorage.getItem('accountType'));
console.log('User ID:', localStorage.getItem('userId'));
```

### Check sessionStorage
```javascript
// In browser console
console.log('Buy Now Intent:', sessionStorage.getItem('buyNowIntent'));
console.log('Checkout Intent:', sessionStorage.getItem('checkoutIntent'));
```

### Check IndexedDB
1. Open DevTools (F12)
2. Go to Application tab
3. Expand IndexedDB
4. Click on DownxtownUserDB
5. Check each table:
   - personal_users
   - business_users
   - addresses
   - auth_info

### Test authService Methods
```javascript
// In browser console
import { authService } from '@/lib/auth/authService';

// Check if authenticated
console.log('Is Authenticated:', authService.isAuthenticated());

// Get account type
console.log('Account Type:', authService.getAccountType());

// Check if has address
authService.hasAddress().then(has => console.log('Has Address:', has));

// Get current user
authService.getCurrentUser().then(user => console.log('Current User:', user));

// Get user address
authService.getUserAddress().then(addr => console.log('Address:', addr));
```

### Test userStorage Methods
```javascript
// In browser console
import { userStorage } from '@/lib/storage/userStorage';

// Get current user
userStorage.getCurrentUser().then(user => console.log('User:', user));

// Get address
userStorage.getUserAddress().then(addr => console.log('Address:', addr));

// Check if has address
userStorage.hasAddress().then(has => console.log('Has Address:', has));
```

## Common Issues & Solutions

### Issue 1: "Cannot find module" errors
**Solution**: Restart the Next.js dev server
```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

### Issue 2: IndexedDB not updating
**Solution**: 
1. Clear IndexedDB manually in DevTools
2. Refresh the page
3. Login again

### Issue 3: Intent not restoring after login
**Solution**: 
1. Check if sessionStorage has the intent before login
2. Check if intent is being cleared too early
3. Verify the login flow in LoginPage.tsx

### Issue 4: Address not saving
**Solution**:
1. Check network tab for API call
2. Verify Firebase ID token is valid
3. Check IndexedDB for address data
4. Verify backend API is working

### Issue 5: Redirect loop
**Solution**:
1. Clear all storage (localStorage, sessionStorage, IndexedDB)
2. Logout completely
3. Start fresh

## Test Credentials

### Personal Account (Buyer)
```
Phone: +91XXXXXXXXXX
Password: your_password
Account Type: PERSONAL
```

### Business Account (Seller)
```
Phone: +91XXXXXXXXXX
Password: your_password
Account Type: BUSINESS
```

## API Endpoints to Monitor

### Login
```
POST https://downxtown.com/auth/login/phone-password
```

### Get Address
```
GET https://downxtown.com/user/address
Authorization: Bearer <firebase_id_token>
```

### Save Address
```
POST https://downxtown.com/user/address
Authorization: Bearer <firebase_id_token>
```

### Create Order
```
POST https://downxtown.com/checkout/create-order
Authorization: Bearer <firebase_id_token>
```

## Network Tab Monitoring

Watch for these requests in DevTools → Network:
1. Login request → Should return 200 with user data
2. Firebase sign-in → Should succeed
3. Address GET → Should return address or 404
4. Address POST → Should return 200
5. Create order → Should return 200 with order ID

## Success Criteria

✅ **Flow is working correctly when**:
1. New users can buy products after login and adding address
2. Returning users with address can buy directly
3. Business accounts cannot buy
4. All data persists in IndexedDB
5. Intents are saved and restored correctly
6. Logout clears all data
7. No console errors
8. All redirects work as expected

## Performance Checks

- [ ] IndexedDB operations are fast (< 100ms)
- [ ] No memory leaks
- [ ] No unnecessary re-renders
- [ ] Smooth transitions between pages
- [ ] Toast messages appear and disappear correctly

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers

## Final Checklist

Before considering the implementation complete:
- [ ] All 8 test scenarios pass
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Data persists correctly
- [ ] All redirects work
- [ ] Error messages are clear
- [ ] Loading states are shown
- [ ] Backend integration works
- [ ] Documentation is complete
- [ ] Code is clean and commented
