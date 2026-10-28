import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, ShieldCheck, Truck, RefreshCw, Headphones, 
  Star, ChevronRight, X, Plus, Minus, Phone, MapPin, 
  Clock, Flame, Smartphone, Cpu, Droplets, Layers, Wrench, Sparkles, Check,
  Tag, Percent, ArrowUpDown, User
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, STORE_FEATURES, STORE_INFO, BRANDS, PROMO_DEALS } from './data/products';
import ProductPage from './ProductPage';
import CheckoutPage from './CheckoutPage';
import TrustPage from './TrustPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import AdminDashboard from './AdminDashboard';
import { authService } from './data/authService';
import './App.css';

// Route hash: #/product/<slug>. Ambil slug dari hash saat ini.
const getSlugFromHash = () => {
  const m = window.location.hash.match(/^#\/product\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
};

export default function App() {
  const [isAgeVerified, setIsAgeVerified] = useState(() => {
    try {
      return localStorage.getItem('rtv_age_verified') === 'true';
    } catch {
      return false;
    }
  });
  const queryParams = new URLSearchParams(window.location.search);
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(queryParams.get('q') || '');
  const [minPrice, setMinPrice] = useState(queryParams.get('min') || '');
  const [maxPrice, setMaxPrice] = useState(queryParams.get('max') || '');
  const [nicotineFilter, setNicotineFilter] = useState(queryParams.get('nicotine') || 'all');
  const [sizeFilter, setSizeFilter] = useState(queryParams.get('size') || 'all');
  const [page, setPage] = useState(Number(queryParams.get('page')) || 1);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('rtv_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [loginRedirect, setLoginRedirect] = useState(null);
  const [activeRoute, setActiveRoute] = useState(() => {
    const match = window.location.hash.match(/^#\/(login|profile|account|about|policy|admin)$/);
    return match ? match[1] : (authService.getCurrentUser() ? null : 'login');
  });
  const [brandFilter, setBrandFilter] = useState(queryParams.get('brand') || 'all');
  const [onlyDiscount, setOnlyDiscount] = useState(queryParams.get('discount') === '1');
  const [sortBy, setSortBy] = useState(queryParams.get('sort') || 'default');
  const [showCatalogFilters, setShowCatalogFilters] = useState(false);
  const [trustRoute, setTrustRoute] = useState(() => window.location.hash.match(/^#\/(about|policy)$/)?.[1] || null);
  const [productSlug, setProductSlug] = useState(getSlugFromHash);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderVisible(currentScrollY < 24 || currentScrollY < lastScrollY);
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('rtv_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  useEffect(() => {
    const params = new URLSearchParams();
    const filters = { q: searchQuery, category: selectedCategory !== 'all' ? selectedCategory : '', brand: brandFilter !== 'all' ? brandFilter : '', min: minPrice, max: maxPrice, nicotine: nicotineFilter !== 'all' ? nicotineFilter : '', size: sizeFilter !== 'all' ? sizeFilter : '', discount: onlyDiscount ? '1' : '', sort: sortBy !== 'default' ? sortBy : '', page: page > 1 ? String(page) : '' };
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    const next = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${next ? `?${next}` : ''}${window.location.hash}`);
  }, [searchQuery, selectedCategory, brandFilter, minPrice, maxPrice, nicotineFilter, sizeFilter, onlyDiscount, sortBy, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, brandFilter, minPrice, maxPrice, nicotineFilter, sizeFilter, onlyDiscount, sortBy]);


  useEffect(() => {
    const onHash = () => {
      const slug = getSlugFromHash();
      setProductSlug(slug);
      const match = window.location.hash.match(/^#\/(login|profile|account|about|policy|admin)$/);
      const matchedRoute = match ? match[1] : null;
      setActiveRoute(matchedRoute);
      setTrustRoute(window.location.hash.match(/^#\/(about|policy)$/)?.[1] || null);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleVerifyAge = () => {
    localStorage.setItem('rtv_age_verified', 'true');
    setIsAgeVerified(true);
  };

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Selamat datang kembali, ${user.name}!`);
    if (loginRedirect === 'checkout') {
      setLoginRedirect(null);
      window.location.hash = '';
      setIsCheckoutOpen(true);
    } else {
      window.location.hash = '';
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    window.location.hash = '#/login';
    showToast('Anda telah keluar dari akun');
  };

  const addToCart = (product, qty = 1) => {
    if (!product.price || product.price <= 0) {
      showToast(`Harga belum ditentukan untuk produk ini. Silakan hubungi kami.`);
      return;
    }

    const maxStock = typeof product.stock === 'number' ? product.stock : Infinity;
    if (product.inStock === false || maxStock <= 0) {
      showToast(`Maaf, stok ${product.name.slice(0, 20)}... sedang habis`);
      return;
    }

    let reachedMax = false;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      const currentQty = existing ? existing.quantity : 0;

      if (currentQty >= maxStock) {
        reachedMax = true;
        return prevCart;
      }

      const newQty = Math.min(currentQty + qty, maxStock);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { ...product, quantity: newQty }];
    });

    if (reachedMax) {
      showToast(`Kuantitas sudah mencapai batas stok (${maxStock})`);
    } else {
      showToast(`Ditambahkan ke keranjang: ${product.name.slice(0, 24)}...`);
    }
  };

  const requireLoginForCheckout = () => {
    if (currentUser) {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
      return;
    }
    setIsCartOpen(false);
    setLoginRedirect('checkout');
    window.location.hash = '#/login';
    showToast('Silakan login terlebih dahulu untuk checkout');
  };


  const activeProduct = productSlug
    ? PRODUCTS.find((p) => p.slug === productSlug)
    : null;

  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const maxStock = typeof item.stock === 'number' ? item.stock : Infinity;
            if (delta > 0 && item.quantity >= maxStock) {
              showToast(`Kuantitas sudah mencapai batas stok (${maxStock})`);
              return item;
            }
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: Math.min(newQty, maxStock) } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const hasActiveFilter = brandFilter !== 'all' || onlyDiscount || sortBy !== 'default' || searchQuery !== '' || selectedCategory !== 'all' || minPrice || maxPrice || nicotineFilter !== 'all' || sizeFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery(''); setSelectedCategory('all'); setBrandFilter('all'); setOnlyDiscount(false); setSortBy('default'); setMinPrice(''); setMaxPrice(''); setNicotineFilter('all'); setSizeFilter('all'); setPage(1);
  };

  const q = searchQuery.toLowerCase();
  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesBrand = brandFilter === 'all' || item.brand === brandFilter;
    const matchesDiscount = !onlyDiscount || item.discountPercent >= 15;
    const matchesSearch = item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q);
    const matchesPrice = (!minPrice || (item.price || 0) >= Number(minPrice)) && (!maxPrice || (item.price || 0) <= Number(maxPrice));
    const matchesNicotine = nicotineFilter === 'all' || item.nicotineOptions?.includes(nicotineFilter);
    const matchesSize = sizeFilter === 'all' || item.sizeOptions?.includes(sizeFilter);
    return matchesCategory && matchesBrand && matchesDiscount && matchesSearch && matchesPrice && matchesNicotine && matchesSize;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return (a.price ?? Infinity) - (b.price ?? Infinity);
      case 'price-desc': return (b.price ?? 0) - (a.price ?? 0);
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviewsCount - a.reviewsCount;
      case 'newest': return (b.createdAt || b.id || 0) - (a.createdAt || a.id || 0);
      default: return 0;
    }
  });
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const formatRupiah = (num) => {
    if (num === null || num === undefined || num <= 0) {
      return 'Hubungi kami';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const getCategoryIcon = (iconName) => {
    const shapes = {
      Sparkles: <><path d="M8 4v4M6 6h4M17 13v6M14 16h6" /><path d="m12 10 1.6 3.4L17 15l-3.4 1.6L12 20l-1.6-3.4L7 15l3.4-1.6L12 10Z" /></>,
      Smartphone: <><rect x="8" y="3" width="8" height="18" rx="2.2" /><path d="M10 6h4M10.5 17h3" /><path d="M8 8h8" /></>,
      Cpu: <><rect x="6" y="5" width="12" height="15" rx="2" /><path d="M9 8h6v7H9zM9 3v2M15 3v2M9 20v1M15 20v1M3 9h3M3 16h3M18 9h3M18 16h3" /></>,
      Droplets: <><path d="M7 5h10l1 4v10H6V9l1-4Z" /><path d="M7 5h10M9 9h6v6H9zM10 3h4" /></>,
      Flame: <><path d="M9 5h6l1 4v11H8V9l1-4Z" /><path d="M9 9h6M10 12h4M10 3h4" /><path d="M10 16h4" /></>,
      Layers: <><path d="M8 4h8v5H8zM6 9h12v5H6zM8 14h8v6H8z" /><path d="M10 6h4M8 11h8M10 17h4" /></>,
      Wrench: <><path d="M8 4h8l2 3v4H6V7l2-3Z" /><path d="M9 11v8h6v-8M11 14h2M10 21h4" /></>
    };
    return <svg className="category-original-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[iconName] || shapes.Sparkles}</svg>;
  };

  const getFeatureIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck size={24} />;
      case 'Truck': return <Truck size={24} />;
      case 'RefreshCw': return <RefreshCw size={24} />;
      case 'Headphones': return <Headphones size={24} />;
      default: return <ShieldCheck size={24} />;
    }
  };

  const [heroSlide, setHeroSlide] = useState(0);
  const heroBanners = ['/images/banner1.jpg', '/images/banner2.jpg', '/images/banner3.jpg'];

  useEffect(() => {
    const timer = window.setInterval(() => setHeroSlide((current) => (current + 1) % heroBanners.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="rtv-app">
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--primary-red)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(229, 24, 55, 0.4)',
          zIndex: 9999,
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {notification}
        </div>
      )}

      {/* Age Verification Modal */}
      {!isAgeVerified && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-badge">21+</div>
            <h2>Verifikasi Usia</h2>
            <p>
              Selamat datang di <strong>Rumah Tua Vape (RTV)</strong>. Konten dan produk di situs ini hanya ditujukan untuk orang dewasa berusia 21 tahun ke atas.
            </p>
            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => alert("Maaf, Anda harus berusia 21+ untuk mengakses website ini.")}
              >
                Saya di bawah 21
              </button>
              <button className="btn-primary" onClick={handleVerifyAge}>
                Saya 21+ Tahun (Masuk)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-item">
            <MapPin size={14} color="var(--primary-red)" />
            <span>Store: {STORE_INFO.address}</span>
          </div>
          <div className="top-bar-links">
            <div className="top-bar-item">
              <Clock size={14} color="var(--primary-red)" />
              <span>Buka: {STORE_INFO.openingHours.weekdays}</span>
            </div>
            <a href={`https://wa.me/${STORE_INFO.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="top-bar-item">
              <Phone size={14} color="#10B981" />
              <span>CS WhatsApp: {STORE_INFO.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`header ${isHeaderVisible ? 'header-visible' : 'header-hidden'}`}>
        <div className="container">
          <div className="header-main">
            <a href="#" className="brand-logo">
              <img src="/images/logo.webp" alt="Rumah Tua Vape Logo" />
              <div className="brand-text">
                <h1>RUMAH TUA <span>VAPE</span></h1>
                <p>Authentic Vaping Store</p>
              </div>
            </a>

            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Cari device, liquid, coil, atau brand favoritmu..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                list="product-suggestions"
              />
              <datalist id="product-suggestions">
                {PRODUCTS.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8).map((item) => <option key={item.id} value={item.name} />)}
              </datalist>
            </div>

            <div className="header-actions">
              {currentUser ? (
                <a className="btn-user-header" href="#/profile" title={`Akun Saya: ${currentUser.name}`}>
                  <div className="header-avatar-circle">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="header-user-name">{currentUser.name.split(' ')[0]}</span>
                </a>
              ) : (
                <a className="btn-icon" href="#/login" title="Masuk / Daftar Akun">
                  <User size={20} />
                </a>
              )}
              <button 
                className="btn-icon" 
                onClick={() => setIsCartOpen(true)}
                title="Lihat Keranjang Belanja"
              >
                <ShoppingBag size={20} />
                {totalCartCount > 0 && (
                  <span className="cart-count">{totalCartCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="nav-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`nav-link ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {isCheckoutOpen ? (
        <CheckoutPage
          cart={cart}
          totalPrice={totalCartPrice}
          formatRupiah={formatRupiah}
          whatsapp={STORE_INFO.whatsapp.replace(/[^0-9]/g, '')}
          currentUser={currentUser}
          onBack={() => setIsCheckoutOpen(false)}
          onComplete={() => setCart([])}
          onGoToProfile={() => {
            setIsCheckoutOpen(false);
            window.location.hash = '#/profile';
          }}
        />
      ) : activeRoute === 'admin' ? (
        <AdminDashboard onLogout={() => { window.location.hash = '#/login'; }} />
      ) : activeRoute === 'login' ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={() => { window.location.hash = ''; }}
          redirectReason={loginRedirect}
        />
      ) : activeRoute === 'profile' || (activeRoute === 'account' && currentUser) ? (
        <ProfilePage
          user={currentUser}
          products={PRODUCTS}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
          }}
          onLogout={handleLogout}
          onAddToCart={addToCart}
          formatRupiah={formatRupiah}
          whatsapp={STORE_INFO.whatsapp}
          onNavigateToHome={() => { window.location.hash = ''; }}
        />
      ) : activeRoute === 'account' && !currentUser ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={() => { window.location.hash = ''; }}
        />
      ) : activeRoute === 'wishlist' && currentUser ? (
        <ProfilePage
          user={currentUser}
          defaultTab="wishlist"
          products={PRODUCTS}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
          }}
          onLogout={handleLogout}
          onAddToCart={addToCart}
          formatRupiah={formatRupiah}
          whatsapp={STORE_INFO.whatsapp}
          onNavigateToHome={() => { window.location.hash = ''; }}
        />
      ) : activeRoute === 'wishlist' ? (
        <TrustPage
          type="wishlist"
          products={PRODUCTS}
          onLogin={(email) => {
            const u = authService.login(email, '');
            handleLoginSuccess(u);
          }}
        />
      ) : trustRoute ? (
        <TrustPage
          type={trustRoute}
          products={PRODUCTS}
          onLogin={(email) => {
            const u = authService.login(email, '');
            handleLoginSuccess(u);
          }}
        />
      ) : productSlug && !activeProduct ? (
        <main className="product-not-found">
          <div className="product-not-found-card">
            <span className="section-tag">404 Â· PRODUK TIDAK DITEMUKAN</span>
            <h1>Produk ini tidak tersedia</h1>
            <p>Slug produk tidak valid atau produk sudah tidak tercatat di katalog.</p>
            <a className="btn-primary" href="#featured-products">Kembali ke katalog</a>
          </div>
        </main>
      ) : activeProduct ? (
        <ProductPage
          product={activeProduct}
          formatRupiah={formatRupiah}
          whatsapp={STORE_INFO.whatsapp.replace(/[^0-9]/g, '')}
          onAddToCart={addToCart}
          onBuyNow={(product, qty) => {
            addToCart(product, qty);
            requireLoginForCheckout();
          }}
        />
      ) : (
      <>
      {/* Hero Banner Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-layout">
            <div className="hero-banner hero-slider" aria-label="Banner promosi RTV">
              <div className="hero-slides" style={{ transform: `translateX(-${heroSlide * 100}%)` }}>
                {heroBanners.map((banner, index) => (
                  <img key={banner} src={banner} alt={`Banner promosi RTV ${index + 1}`} className="hero-slide-image" />
                ))}
              </div>
              <div className="hero-slider-dots" aria-label="Pilih banner">
                {heroBanners.map((banner, index) => (
                  <button key={banner} className={heroSlide === index ? 'active' : ''} onClick={() => setHeroSlide(index)} aria-label={`Tampilkan banner ${index + 1}`} />
                ))}
              </div>
            </div>
            <div className="hero-side-grid">
              {[
                ['Best Selling Liquid', '/images/product_eliquid.jpg', 'liquid'],
                ['Pembelian Wholesale', '/images/product_pod_colorful.jpg', 'all'],
                ['Best Pod System', '/images/product_pod_black.jpg', 'pod'],
                ['New Arrival Product', '/images/product_mod.jpg', 'mod']
              ].map(([title, image, category]) => (
                <button key={title} className="hero-side-card" onClick={() => setSelectedCategory(category)}>
                  <span>{title}</span><small>Shop Now</small><img src={image} alt={title} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Products Showcase Section */}
      <section id="featured-products" className="container">
        <div className="section-header catalog-heading">
          <div className="section-header-title">
            <span className="section-tag">CATALOG PILIHAN</span>
            <h2 className="section-title">
              {selectedCategory === 'all' ? 'Semua Produk Pilihan' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
          </div>
          <button className="catalog-filter-toggle" onClick={() => setShowCatalogFilters((visible) => !visible)} aria-expanded={showCatalogFilters}>
            Filter <ChevronRight size={14} className={showCatalogFilters ? 'filter-chevron-open' : ''} />
          </button>
        </div>

        <div className={`catalog-toolbar ${showCatalogFilters ? 'filters-open' : 'filters-closed'}`}>
          <div className="toolbar-group-left">
            <div className="filter-select-box"><Tag size={14} /><select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>{BRANDS.map((b) => <option key={b} value={b === 'Semua Brand' ? 'all' : b}>{b}</option>)}</select></div>
            <input className="catalog-price-input" type="number" min="0" placeholder="Harga min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <input className="catalog-price-input" type="number" min="0" placeholder="Harga max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            <select className="catalog-filter-select" value={nicotineFilter} onChange={(e) => setNicotineFilter(e.target.value)}><option value="all">Semua nikotin</option>{[...new Set(PRODUCTS.flatMap((item) => item.nicotineOptions || []))].map((option) => <option key={option} value={option}>{option}</option>)}</select>
            <select className="catalog-filter-select" value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}><option value="all">Semua ukuran</option>{[...new Set(PRODUCTS.flatMap((item) => item.sizeOptions || []))].map((option) => <option key={option} value={option}>{option}</option>)}</select>
            <button className={`btn-toggle-discount ${onlyDiscount ? 'active' : ''}`} onClick={() => setOnlyDiscount(!onlyDiscount)}><Percent size={14} /> Diskon ≥ 15%</button>
          </div>
          <div className="toolbar-group-right">
            <span className="catalog-results-count">{filteredProducts.length} produk</span>
            <div className="filter-select-box"><ArrowUpDown size={14} /><select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="default">Urutkan: Default</option><option value="price-asc">Harga Terendah</option><option value="price-desc">Harga Tertinggi</option><option value="rating">Rating Tertinggi</option><option value="reviews">Paling Laris</option><option value="newest">Terbaru</option></select></div>
            {hasActiveFilter && <button className="btn-reset-filters" onClick={resetFilters}><X size={12} /> Reset</button>}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <h3>Tidak ada produk yang cocok dengan pencarian "{searchQuery}"</h3>
            <button 
              className="btn-secondary" 
              style={{ marginTop: '16px' }}
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {visibleProducts.map((product) => (
              <div key={product.id} className="product-card">
                <a className="product-card-link" href={`#/product/${product.slug}`}>
                  <div className="product-thumb-container">
                    {product.badge && (
                      <span className="badge badge-dark product-badge-float">
                        {product.badge}
                      </span>
                    )}
                    {product.isSale && (
                      <span className="product-discount-float">
                        -{product.discountPercent}%
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-thumb"
                      loading="lazy"
                    />
                  </div>

                  <div className="product-info">
                    <span className="product-brand">{product.brand}</span>
                    <h3 className="product-name" title={product.name}>{product.name}</h3>

                    <div className="product-rating">
                      <div className="rating-stars">
                        <Star size={14} fill="currentColor" />
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{product.rating}</span>
                      </div>
                      <span className="rating-count">({product.reviewsCount} ulasan)</span>
                    </div>

                    <div className="product-price-row">
                      <div className="product-price">{formatRupiah(product.price)}</div>
                      {product.originalPrice && (
                        <div className="product-price-original">
                          {formatRupiah(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    <div className="product-stock-info">
                      {product.inStock === false || (typeof product.stock === 'number' && product.stock <= 0)
                        ? 'Stok habis'
                        : typeof product.stock === 'number'
                          ? `Stok: ${product.stock}`
                          : 'Stok tersedia'}
                    </div>
                  </div>
                </a>

                <div className="product-info product-info-actions">
                  {product.price && product.price > 0 ? (
                    <button 
                      className="btn-add-cart" 
                      disabled={product.inStock === false || (typeof product.stock === 'number' && product.stock <= 0)}
                      onClick={() => addToCart(product)}
                    >
                      <Plus size={16} /> Beli
                    </button>
                  ) : (
                    <a
                      className="btn-add-cart"
                      href={`https://wa.me/${STORE_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo RTV, saya ingin tanya harga & info produk: ${product.name}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      Hubungi kami
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <nav className="catalog-pagination" aria-label="Paginasi katalog">
            <button className="pagination-arrow" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>&lt;&lt;</button>
            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button key={pageNumber} className={page === pageNumber ? 'active' : ''} aria-label={`Halaman ${pageNumber}`} aria-current={page === pageNumber ? 'page' : undefined} onClick={() => setPage(pageNumber)}>{pageNumber}</button>
              ))}
            </div>
            <button className="pagination-arrow" aria-label="Halaman berikutnya" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>&gt;&gt;</button>
          </nav>
        )}
      </section>
      </>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>
                <ShoppingBag size={20} color="var(--primary-red)" /> 
                Keranjang Belanja ({totalCartCount})
              </h3>
              <button 
                className="btn-icon" 
                onClick={() => setIsCartOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="cart-body">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag className="cart-empty-icon" />
                  <h4>Keranjang Masih Kosong</h4>
                  <p style={{ fontSize: '13px', marginTop: '6px' }}>
                    Yuk pilih pod, mod, atau liquid favoritmu!
                  </p>
                  <button
                    className="btn-primary"
                    style={{ marginTop: '20px' }}
                    onClick={() => setIsCartOpen(false)}
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <div>
                        <div className="cart-item-title">{item.name}</div>
                        <div className="cart-item-price">{formatRupiah(item.price)}</div>
                      </div>
                      <div className="cart-item-controls">
                        <div className="quantity-btn-group">
                          <button
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '13px', fontWeight: '700', padding: '0 6px' }}>
                            {item.quantity}
                          </span>
                          <button
                            className="quantity-btn"
                            disabled={typeof item.stock === 'number' && item.quantity >= item.stock}
                            onClick={() => updateQuantity(item.id, 1)}
                            title={typeof item.stock === 'number' && item.quantity >= item.stock ? `Maksimal stok: ${item.stock}` : 'Tambah'}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {formatRupiah(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal">
                  <span style={{ color: 'var(--text-secondary)' }}>Total Pembayaran</span>
                  <span className="cart-total-price">{formatRupiah(totalCartPrice)}</span>
                </div>
                <button
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px' }}
                  onClick={() => {
                    requireLoginForCheckout();
                  }}
                >
                  Lanjut ke Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand-logo" style={{ marginBottom: '12px' }}>
                <img src="/images/logo.webp" alt="RTV Logo" />
                <div className="brand-text">
                  <h1>RUMAH TUA <span>VAPE</span></h1>
                  <p>Authentic Vaping Store</p>
                </div>
              </div>
              <p>
                Rumah Tua Vape (RTV) berkomitmen menghadirkan produk vaping authentic berkualitas terbaik, edukasi penggunaan yang bertanggung jawab, serta pelayanan komunitas vapers di seluruh Indonesia.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a 
                  href={`https://wa.me/${STORE_INFO.whatsapp.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  Chat WhatsApp
                </a>
              </div>
            </div>

            <div>
              <h4 className="footer-heading">Kategori Produk</h4>
              <ul className="footer-links">
                {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                  <li key={c.id}>
                    <a href="#featured-products" onClick={() => setSelectedCategory(c.id)}>
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="footer-heading">Layanan & Akun</h4>
              <ul className="footer-links">
                <li><a href="#/profile">Akun & Profil Member</a></li>
                <li><a href="#/wishlist">Wishlist Saya</a></li>
                <li><a href="#/about">Tentang Rumah Tua Lounge</a></li>
                <li><a href="#/policy">Ketentuan Retur & Garansi</a></li>
                <li><a href="#">Panduan Pemula (Coil & Ohm)</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-heading">Lokasi & Jam Buka</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
                {STORE_INFO.address}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '6px' }}>
                <strong>Senin - Jumat:</strong> {STORE_INFO.openingHours.weekdays}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                <strong>Sabtu - Minggu:</strong> {STORE_INFO.openingHours.weekend}
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              Â© 2026 Rumah Tua Vape (RTV). Hak cipta dilindungi undang-undang.
            </div>
            <div>
              Peringatan: Produk ini mengandung nikotin. Hanya untuk 21+ tahun.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

