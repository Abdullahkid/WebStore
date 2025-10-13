// User data storage service using IndexedDB (similar to Android Room database)
// Based on Sigma2 UserDatabase and UserDataSource patterns

import { 
  StoredPersonalUser, 
  StoredBusinessUser, 
  StoredAddress, 
  AccountType,
  PersonalDto,
  BusinessDto
} from '@/types/user';

class UserStorageService {
  private dbName = 'DownxtownUserDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  // Initialize IndexedDB (similar to Room database setup)
  async initDB(): Promise<void> {
    // Only initialize on client side
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create Personal Users table
        if (!db.objectStoreNames.contains('personal_users')) {
          const personalStore = db.createObjectStore('personal_users', { keyPath: 'id' });
          personalStore.createIndex('username', 'username', { unique: true });
          personalStore.createIndex('phoneNumber', 'phoneNumber', { unique: true });
        }

        // Create Business Users table
        if (!db.objectStoreNames.contains('business_users')) {
          const businessStore = db.createObjectStore('business_users', { keyPath: 'id' });
          businessStore.createIndex('username', 'username', { unique: true });
          businessStore.createIndex('phoneNumber', 'phoneNumber', { unique: true });
        }

        // Create Addresses table
        if (!db.objectStoreNames.contains('addresses')) {
          const addressStore = db.createObjectStore('addresses', { keyPath: 'userId' });
        }

        // Create Auth Info table
        if (!db.objectStoreNames.contains('auth_info')) {
          db.createObjectStore('auth_info', { keyPath: 'key' });
        }
      };
    });
  }

  // Ensure DB is initialized
  private async ensureDB(): Promise<IDBDatabase> {
    // Guard against server-side execution
    if (typeof window === 'undefined') {
      throw new Error('IndexedDB is not available on server side');
    }

    if (!this.db) {
      await this.initDB();
    }
    return this.db!;
  }

  // Save authentication info (tokens, account type)
  async saveAuthInfo(authToken: string, accountType: AccountType, userId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['auth_info'], 'readwrite');
    const store = transaction.objectStore('auth_info');

    await Promise.all([
      this.promisifyRequest(store.put({ key: 'authToken', value: authToken })),
      this.promisifyRequest(store.put({ key: 'accountType', value: accountType })),
      this.promisifyRequest(store.put({ key: 'userId', value: userId })),
      this.promisifyRequest(store.put({ key: 'loginTime', value: Date.now() }))
    ]);

    // Also save to localStorage for quick access (like Android SharedPreferences)
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('accountType', accountType);
    localStorage.setItem('userId', userId);
  }

  // Save personal user data (from initialUser in login response)
  async savePersonalUser(personalDto: PersonalDto): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['personal_users', 'addresses'], 'readwrite');
    
    // Save user data
    const userStore = transaction.objectStore('personal_users');
    const storedUser: StoredPersonalUser = {
      id: personalDto.id,
      username: personalDto.username,
      email: personalDto.email,
      phoneNumber: personalDto.phoneNumber,
      fullName: personalDto.fullName,
      profileImage: personalDto.profileImage,
      dateOfBirth: personalDto.dateOfBirth,
      gender: personalDto.gender,
      isVerified: personalDto.isVerified,
      createdAt: personalDto.createdAt,
      updatedAt: personalDto.updatedAt
    };
    
    await this.promisifyRequest(userStore.put(storedUser));

    // Save address if exists
    if (personalDto.address) {
      const addressStore = transaction.objectStore('addresses');
      const storedAddress: StoredAddress = {
        userId: personalDto.id,
        addressLine1: personalDto.address.addressLine1,
        addressLine2: personalDto.address.addressLine2,
        city: personalDto.address.city,
        state: personalDto.address.state,
        pincode: personalDto.address.pincode,
        country: personalDto.address.country,
        landmark: personalDto.address.landmark,
        addressType: personalDto.address.addressType as 'HOME' | 'WORK' | 'OTHER',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await this.promisifyRequest(addressStore.put(storedAddress));
    }
  }

  // Save business user data (from initialBusiness in login response)
  async saveBusinessUser(businessDto: BusinessDto): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['business_users', 'addresses'], 'readwrite');
    
    // Save business data
    const businessStore = transaction.objectStore('business_users');
    const storedBusiness: StoredBusinessUser = {
      id: businessDto.id,
      username: businessDto.username,
      email: businessDto.email,
      phoneNumber: businessDto.phoneNumber,
      businessName: businessDto.businessName,
      businessType: businessDto.businessType,
      businessDescription: businessDto.businessDescription,
      businessLogo: businessDto.businessLogo,
      businessBanner: businessDto.businessBanner,
      isVerified: businessDto.isVerified,
      createdAt: businessDto.createdAt,
      updatedAt: businessDto.updatedAt
    };
    
    await this.promisifyRequest(businessStore.put(storedBusiness));

    // Save business address if exists
    if (businessDto.businessAddress) {
      const addressStore = transaction.objectStore('addresses');
      const storedAddress: StoredAddress = {
        userId: businessDto.id,
        addressLine1: businessDto.businessAddress.addressLine1,
        addressLine2: businessDto.businessAddress.addressLine2,
        city: businessDto.businessAddress.city,
        state: businessDto.businessAddress.state,
        pincode: businessDto.businessAddress.pincode,
        country: businessDto.businessAddress.country,
        landmark: businessDto.businessAddress.landmark,
        addressType: businessDto.businessAddress.addressType as 'HOME' | 'WORK' | 'OTHER',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await this.promisifyRequest(addressStore.put(storedAddress));
    }
  }

  // Get current user (personal or business)
  async getCurrentUser(): Promise<StoredPersonalUser | StoredBusinessUser | null> {
    const accountType = localStorage.getItem('accountType') as AccountType;
    const userId = localStorage.getItem('userId');
    
    if (!accountType || !userId) return null;

    const db = await this.ensureDB();
    
    if (accountType === AccountType.PERSONAL) {
      const transaction = db.transaction(['personal_users'], 'readonly');
      const store = transaction.objectStore('personal_users');
      return await this.promisifyRequest(store.get(userId));
    } else {
      const transaction = db.transaction(['business_users'], 'readonly');
      const store = transaction.objectStore('business_users');
      return await this.promisifyRequest(store.get(userId));
    }
  }

  // Get user address
  async getUserAddress(): Promise<StoredAddress | null> {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;

    const db = await this.ensureDB();
    const transaction = db.transaction(['addresses'], 'readonly');
    const store = transaction.objectStore('addresses');
    
    return await this.promisifyRequest(store.get(userId));
  }

  // Update user address
  async updateUserAddress(address: Omit<StoredAddress, 'userId' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not logged in');

    const db = await this.ensureDB();
    const transaction = db.transaction(['addresses'], 'readwrite');
    const store = transaction.objectStore('addresses');
    
    const existingAddress = await this.promisifyRequest(store.get(userId));
    const storedAddress: StoredAddress = {
      userId,
      ...address,
      createdAt: existingAddress?.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    
    await this.promisifyRequest(store.put(storedAddress));
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Check if user has address
  async hasAddress(): Promise<boolean> {
    const address = await this.getUserAddress();
    return !!address && !!address.addressLine1;
  }

  // Get account type
  getAccountType(): AccountType | null {
    return localStorage.getItem('accountType') as AccountType;
  }

  // Clear all user data (logout)
  async clearUserData(): Promise<void> {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('accountType');
    localStorage.removeItem('userId');

    // Clear IndexedDB
    const db = await this.ensureDB();
    const transaction = db.transaction(['personal_users', 'business_users', 'addresses', 'auth_info'], 'readwrite');
    
    await Promise.all([
      this.promisifyRequest(transaction.objectStore('personal_users').clear()),
      this.promisifyRequest(transaction.objectStore('business_users').clear()),
      this.promisifyRequest(transaction.objectStore('addresses').clear()),
      this.promisifyRequest(transaction.objectStore('auth_info').clear())
    ]);
  }

  // Helper to promisify IndexedDB requests
  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Export singleton instance
export const userStorage = new UserStorageService();

// Initialize on import (only on client side)
if (typeof window !== 'undefined') {
  userStorage.initDB().catch(console.error);
}
