// Authentication & User Profile Service for Rumah Tua Vape (RTV)

const USER_STORAGE_KEY = 'rtv_user';
const EMAIL_STORAGE_KEY = 'rtv_account_email';
const ORDERS_STORAGE_KEY = 'rtv_order_history';

export const INITIAL_DEMO_USER = {
  name: 'Farhan Putra',
  email: 'farhan@rumahtuavape.com',
  phone: '0812-9876-5432',
  address: 'Jl. Bangka Raya No. 12, RT.04/RW.02, Pela Mampang, Mampang Prapatan',
  city: 'Jakarta Selatan',
  postalCode: '12720',
  memberSince: 'Januari 2025',
  points: 380,
  vapePreference: {
    deviceType: 'Pod System',
    liquidType: 'Saltnic',
    favoriteFlavour: 'Fruity Mint / Ice',
    nicotineLevel: '30mg'
  }
};

export const INITIAL_DEMO_ORDERS = [
  {
    orderId: 'RTV-83921041',
    createdAt: '15 Okt 2026, 14:32 WIB',
    status: 'Sedang Dikirim',
    courier: 'J&T Express',
    trackingNumber: 'JP8291048201',
    payment: 'Transfer Bank (BCA)',
    name: 'Farhan Putra',
    phone: '0812-9876-5432',
    address: 'Jl. Bangka Raya No. 12, Pela Mampang, Jakarta Selatan',
    subtotal: 310000,
    shippingCost: 12000,
    grandTotal: 322000,
    items: [
      {
        id: 1,
        name: 'OXVA Xlim Pro 2 Pod Kit 1000mAh Authentic',
        price: 260000,
        quantity: 1,
        image: '/images/product_pod_black.jpg'
      },
      {
        id: 4,
        name: 'Liquid Tokyo Banana 30ml Saltnic 30mg',
        price: 50000,
        quantity: 1,
        image: '/images/product_eliquid.jpg'
      }
    ]
  },
  {
    orderId: 'RTV-72109432',
    createdAt: '28 Sep 2026, 10:15 WIB',
    status: 'Selesai',
    courier: 'Instant / Sameday',
    trackingNumber: 'GRAB-88291410',
    payment: 'QRIS / GoPay',
    name: 'Farhan Putra',
    phone: '0812-9876-5432',
    address: 'Jl. Bangka Raya No. 12, Pela Mampang, Jakarta Selatan',
    subtotal: 95000,
    shippingCost: 18000,
    grandTotal: 113000,
    items: [
      {
        id: 7,
        name: 'OXVA Cartridge V3 Top Fill 0.6 Ohm (Pack of 3)',
        price: 95000,
        quantity: 1,
        image: '/images/product_pod_colorful.jpg'
      }
    ]
  }
];

export const AVAILABLE_COUPONS = [
  {
    code: 'RTVMEMBER25',
    title: 'Diskon Member Baru',
    discount: 'Rp 25.000',
    minSpend: 'Min. belanja Rp 150.000',
    expiry: 'Berlaku s/d 31 Des 2026',
    type: 'direct'
  },
  {
    code: 'ONGKIRFREE',
    title: 'Gratis Ongkir Se-Jabodetabek',
    discount: 'Potongan Rp 18.000',
    minSpend: 'Min. belanja Rp 100.000',
    expiry: 'Berlaku setiap akhir pekan',
    type: 'shipping'
  },
  {
    code: 'LIQUIDMANIA15',
    title: 'Cashback Liquid 15%',
    discount: 'Maks. Rp 30.000',
    minSpend: 'Khusus kategori Liquid',
    expiry: 'Berlaku s/d 30 Nov 2026',
    type: 'percent'
  }
];

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      const legacyEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
      if (legacyEmail) {
        const fallbackUser = {
          ...INITIAL_DEMO_USER,
          email: legacyEmail,
          name: legacyEmail.split('@')[0].replace(/[._-]/g, ' ')
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fallbackUser));
        return fallbackUser;
      }
      return null;
    } catch {
      return null;
    }
  },

  login(emailOrPhone, password, isRemember = true) {
    let user = this.getCurrentUser();
    if (!user) {
      const isEmail = emailOrPhone.includes('@');
      user = {
        ...INITIAL_DEMO_USER,
        email: isEmail ? emailOrPhone : `${emailOrPhone.replace(/[^0-9]/g, '')}@rtv-member.id`,
        phone: !isEmail ? emailOrPhone : '0812-3456-7890',
        name: isEmail ? emailOrPhone.split('@')[0].replace(/[._-]/g, ' ') : 'Member RTV'
      };
    } else {
      if (emailOrPhone.includes('@')) {
        user.email = emailOrPhone;
      } else {
        user.phone = emailOrPhone;
      }
    }

    if (isRemember) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(EMAIL_STORAGE_KEY, user.email);
    }
    return user;
  },

  register(data) {
    const newUser = {
      ...INITIAL_DEMO_USER,
      name: data.name || 'Member RTV',
      email: data.email,
      phone: data.phone || '',
      memberSince: new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date()),
      tier: 'Silver Member',
      points: 100 // Bonus 100 points for registration
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    localStorage.setItem(EMAIL_STORAGE_KEY, newUser.email);
    return newUser;
  },

  loginDemoUser() {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USER));
    localStorage.setItem(EMAIL_STORAGE_KEY, INITIAL_DEMO_USER.email);
    return INITIAL_DEMO_USER;
  },

  updateProfile(updates) {
    const current = this.getCurrentUser() || INITIAL_DEMO_USER;
    const updated = { ...current, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    if (updated.email) {
      localStorage.setItem(EMAIL_STORAGE_KEY, updated.email);
    }
    return updated;
  },

  logout() {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(EMAIL_STORAGE_KEY);
    } catch (e) {
      console.error('Logout error:', e);
    }
  },

  getOrderHistory() {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with realistic mock orders
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  },

  addOrder(orderData) {
    try {
      const currentOrders = this.getOrderHistory();
      const newOrders = [orderData, ...currentOrders];
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));

      // Award points (1 poin per Rp 1.000)
      const user = this.getCurrentUser();
      if (user) {
        const earnedPoints = Math.max(10, Math.floor((orderData.grandTotal || 0) / 1000));
        const updatedPoints = (user.points || 0) + earnedPoints;
        this.updateProfile({ points: updatedPoints });
      }
      return newOrders;
    } catch (e) {
      console.error('Failed to add order:', e);
      return [];
    }
  }
};
