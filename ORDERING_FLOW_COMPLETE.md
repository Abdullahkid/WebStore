# Complete Ordering Flow Documentation

## Overview
This document describes the complete ordering flow for the Downxtown webstore, from product viewing to checkout.

## Flow Architecture

### 1. Product Detail Page → Buy Now Click

**Location**: `src/components/product/ProductDetailPage.tsx`

**Flow**:
```
User clicks "Buy Now" button
    ↓
Validate variant selection (if product has variants)
    ↓
Check if user is logged in (authToken in localStorage)
    ↓
    ├─ NOT LOGGED IN → Save buyNowIntent to sessionStorage → Redirect to /login
    └─ LOGGED IN → Check account type
                    ↓
                    ├─ NOT PERSONAL → Show error (only personal accounts can buy)
                    └─ IS PERSONAL → Check if user has address
                                      ↓
                                      ├─ NO ADDRESS → Save checkoutIntent → Redirect to /address
                                      └─ HAS ADDRESS → Redirect to /checkout with params
```

### 2. Login Page

**Location**: `src/components/auth/LoginPage.tsx`

**Backend Endpoint**: `POST https://downxtown.com/auth/login/phone-password`

**Request Body**:
```json
{
  "phoneNumber": "+91XXXXXXXXXX",
  "password": "user_password",
  "accountType": "PERSONAL" | "BUSINESS"
}
```

**Response** (`PhonePasswordLoginResponse`):
```json
{
  "success": true,
  "message": "Login successful",
  "customFirebaseToken": "firebase_custom_token",
  "userId": "mongodb_user_id",
  "accountType": "PERSONAL" | "BUSINESS",
  "initialUser": {  // Only for PERSONAL accounts
    "id": "user_id",
    "username": "username",
    "email": "email@example.com",
    "phoneNumber": "+91XXXXXXXXXX",
    "fullName": "Full Name",
    "profileImage": "image_id",
    "dateOfBirth": "YYYY-MM-DD",
    "gender": "MALE|FEMALE|OTHER",
    "address": {  // AddressDto - may be null
      "addressLine1": "Street address",
      "addressLine2": "Apartment/Suite",
      "city": "City",
      "state": "State",
      "pincode": "123456",
      "country": "India",
      "landmark": "Near landmark",
      "addressType": "HOME|WORK|OTHER"
    },
    "isVerified": false,
    "createdAt": 1234567890,
    "updatedAt": 1234567890
  },
  "initialBusiness": null  // Only for BUSINESS accounts
}
```

**Login Process**:
1. User enters phone number and password
2. Select account type (PERSONAL/BUSINESS)
3. Call authService.loginWithPhonePassword()
4. AuthService processes the response:
   - Signs in with Firebase using customFirebaseToken
   - Saves auth info to localStorage and IndexedDB
   - Saves user data (PersonalDto or BusinessDto) to IndexedDB
   - Saves address if present in initialUser.address
5. Check for buyNowIntent or checkoutIntent in sessionStorage
6. If intent exists:
   - Check if user has address
   - If no address → Redirect to /address
   - If has address → Redirect to /checkout with product params
7. If no intent → Redirect to home or original page

### 3. Data Storage

**Storage Service**: `src/lib/storage/userStorage.ts`

**IndexedDB Structure** (similar to Android Room Database):

```
Database: DownxtownUserDB

Tables:
1. personal_users
   - id (primary key)
   - username (indexed, unique)
   - phoneNumber (indexed, unique)
   - email
   - fullName
   - profileImage
   - dateOfBirth
   - gender
   - isVerified
   - createdAt
   - updatedAt

2. business_users
   - id (primary key)
   - username (indexed, unique)
   - phoneNumber (indexed, unique)
   - email
   - businessName
   - businessType
   - businessDescription
   - businessLogo
   - businessBanner
   - isVerified
   - createdAt
   - updatedAt

3. addresses
   - userId (primary key, foreign key)
   - addressLine1
   - addressLine2
   - city
   - state
   - pincode
   - country
   - landmark
   - addressType (HOME|WORK|OTHER)
   - createdAt
   - updatedAt

4. auth_info
   - key (primary key)
   - value
   
   Stored keys:
   - authToken: Firebase custom token
   - accountType: PERSONAL | BUSINESS
   - userId: MongoDB user ID
   - loginTime: Timestamp
```

**localStorage** (for quick access):
- `authToken`: Firebase custom token
- `accountType`: PERSONAL | BUSINESS
- `userId`: MongoDB user ID

**sessionStorage** (for flow management):
- `buyNowIntent`: JSON with productId, variantId, quantity
- `checkoutIntent`: JSON with productId, variantId, quantity

### 4. Address Page

**Location**: `src/app/address/page.tsx`

**Flow**:
```
Page loads
    ↓
Check if user is logged in
    ↓
    ├─ NOT LOGGED IN → Redirect to /login
    └─ LOGGED IN → Check account type
                    ↓
                    ├─ NOT PERSONAL → Redirect to home
                    └─ IS PERSONAL → Fetch existing address from IndexedDB
                                      ↓
                                      Display address form (pre-filled if exists)
                                      ↓
                                      User fills/updates address
                                      ↓
                                      Save to backend (POST /user/address)
                                      ↓
                                      Save to IndexedDB
                                      ↓
                                      Check for checkoutIntent
                                      ↓
                                      ├─ HAS INTENT → Redirect to /checkout with params
                                      └─ NO INTENT → Redirect to home
```

### 5. Checkout Page

**Location**: `src/app/checkout/page.tsx`

**URL Parameters**:
- `customerId`: User ID
- `productId`: Product ID
- `quantity`: Quantity to order
- `variantId`: (optional) Variant ID if product has variants

**Flow**:
```
Page loads with params
    ↓
Verify user is logged in
    ↓
Fetch product details
    ↓
Fetch user address from IndexedDB
    ↓
Display:
    - Product summary
    - Delivery address
    - Payment method selector
    - Bill summary
    - Product policies
    ↓
User selects payment method
    ↓
User clicks "Place Order"
    ↓
Create order (POST /checkout/create-order)
    ↓
    ├─ COD → Redirect to order confirmation
    └─ ONLINE → Initiate payment → Redirect to order confirmation
```

## Authentication Service

**Location**: `src/lib/auth/authService.ts`

**Key Methods**:

1. `loginWithPhonePassword(phoneNumber, password, accountType)`
   - Calls backend login API
   - Processes login response
   - Saves user data to storage
   - Returns PhonePasswordLoginResponse

2. `isAuthenticated()`
   - Checks if authToken exists in localStorage

3. `getAccountType()`
   - Returns current account type (PERSONAL | BUSINESS)

4. `hasAddress()`
   - Checks if user has address in IndexedDB

5. `getCurrentUser()`
   - Returns current user data from IndexedDB

6. `getUserAddress()`
   - Returns user address from IndexedDB

7. `logout()`
   - Signs out from Firebase
   - Clears all user data from localStorage and IndexedDB

8. `validateBuyNowFlow()`
   - Validates if user can proceed with purchase
   - Returns next step: 'login' | 'address' | 'checkout'

## Type Definitions

**Location**: `src/types/user.ts`

**Key Types**:
- `AccountType`: Enum (PERSONAL, BUSINESS)
- `AddressDto`: Address structure
- `PersonalDto`: Personal user data
- `BusinessDto`: Business user data
- `PhonePasswordLoginResponse`: Login API response
- `StoredPersonalUser`: Personal user in IndexedDB
- `StoredBusinessUser`: Business user in IndexedDB
- `StoredAddress`: Address in IndexedDB

## Backend Integration

### Login Endpoint
```
POST https://downxtown.com/auth/login/phone-password
Content-Type: application/json

Body:
{
  "phoneNumber": "+91XXXXXXXXXX",
  "password": "password",
  "accountType": "PERSONAL"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "customFirebaseToken": "token",
  "userId": "id",
  "accountType": "PERSONAL",
  "initialUser": { ... }
}
```

### Address Endpoints
```
GET https://downxtown.com/user/address
Authorization: Bearer <firebase_id_token>

POST https://downxtown.com/user/address
Authorization: Bearer <firebase_id_token>
Content-Type: application/json

Body:
{
  "addressLine1": "Street",
  "city": "City",
  "state": "State",
  "pincode": "123456",
  "country": "India",
  ...
}
```

### Checkout Endpoint
```
POST https://downxtown.com/checkout/create-order
Authorization: Bearer <firebase_id_token>
Content-Type: application/json

Body:
{
  "customerId": "user_id",
  "productId": "product_id",
  "variantId": "variant_id",  // optional
  "quantity": 1,
  "paymentMethod": "COD" | "ONLINE",
  "deliveryAddress": { ... }
}
```

## Error Handling

### Common Scenarios:

1. **User not logged in**
   - Save intent to sessionStorage
   - Redirect to /login
   - After login, resume flow

2. **Business account trying to buy**
   - Show error message
   - Don't allow purchase

3. **No address**
   - Redirect to /address
   - After address saved, continue to checkout

4. **Invalid variant selection**
   - Show error toast
   - Don't proceed

5. **Out of stock**
   - Disable buy button
   - Show out of stock message

## Testing Checklist

- [ ] New user flow: Product → Login → Address → Checkout
- [ ] Returning user with address: Product → Checkout
- [ ] Returning user without address: Product → Address → Checkout
- [ ] Business account cannot buy
- [ ] Variant selection validation
- [ ] Address persistence in IndexedDB
- [ ] Session intent restoration after login
- [ ] Logout clears all data
- [ ] Firebase authentication integration
- [ ] Backend API integration

## Notes

1. The webstore is designed for **personal buyers** (customers), not business sellers
2. Business accounts can view products but cannot make purchases
3. All user data is stored locally in IndexedDB (similar to Android Room)
4. Authentication uses Firebase custom tokens from backend
5. Address is required before checkout
6. The flow matches the Android app (Sigma2) implementation
