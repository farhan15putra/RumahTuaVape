import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, ShieldCheck, Truck, RefreshCw, Headphones, 
  Star, ChevronRight, X, Plus, Minus, Heart, Phone, MapPin, 
  Clock, Flame, Smartphone, Cpu, Droplets, Layers, Wrench, Sparkles, Check,
  Tag, Percent, ArrowUpDown
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, STORE_FEATURES, STORE_INFO, BRANDS, PROMO_DEALS } from './data/products';
import ProductPage from './ProductPage';
import CheckoutPage from './CheckoutPage';
import './App.css';

// Route hash: #/product/<slug>. Ambil slug dari hash saat ini.
const getSlugFromHash = () => {
  const m = window.location.hash.match(/^#\/product\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
};

export default function App() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [brandFilter, setBrandFilter] = useState('all');
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [productSlug, setProductSlug] = useState(getSlugFromHash);

  useEffect(() => {
    const onHash = () => {
      const slug = getSlugFromHash();
      setProductSlug(slug);
      window.scrollTo({ top: 0 });
      if (!slug) {
        window.setTimeout(() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' }), 0);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Check saved age verification
  useEffect(() => {
    const verified = localStorage.getItem('rtv_age_verified');
    if (verified === 'true') {
      setIsAgeVerified(true);
    }
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

  const addToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prevCart, { ...product, quantity: qty }];
    });
    showToast(`✓ Ditambahkan ke keranjang: ${product.name.slice(0, 24)}...`);
  };

  const activeProduct = productSlug
    ? PRODUCTS.find((p) => p.slug === productSlug)
    : null;

  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const hasActiveFilter = brandFilter !== 'all' || onlyDiscount || sortBy !== 'default' || searchQuery !== '' || selectedCategory !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setBrandFilter('all');
    setOnlyDiscount(false);
    setSortBy('default');
  };

  // Filtered & Sorted Products
  const q = searchQuery.toLowerCase();
  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesBrand = brandFilter === 'all' || item.brand === brandFilter;
    const matchesDiscount = !onlyDiscount || item.discountPercent >= 15;
    const matchesSearch = item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q);
    return matchesCategory && matchesBrand && matchesDiscount && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviewsCount - a.reviewsCount;
      default: return 0;
    }
  });

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone size={20} />;
      case 'Cpu': return <Cpu size={20} />;
      case 'Droplets': return <Droplets size={20} />;
      case 'Flame': return <Flame size={20} />;
      case 'Layers': return <Layers size={20} />;
      case 'Wrench': return <Wrench size={20} />;
      default: return <Sparkles size={20} />;
    }
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
      <header className="header">
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="header-actions">
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
          onBack={() => setIsCheckoutOpen(false)}
          onComplete={() => setCart([])}
        />
      ) : activeProduct ? (
        <ProductPage
          product={activeProduct}
          formatRupiah={formatRupiah}
          onAddToCart={addToCart}
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

      {/* Category Strip Grid */}
      <section className="category-strip">
        <div className="container">
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <div className="category-icon">
                  {getCategoryIcon(cat.icon)}
                </div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{cat.count} Produk</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Value Proposition Bar */}
      <section className="container">
        <div className="features-bar">
          {STORE_FEATURES.map((feat, idx) => (
            <div key={idx} className="feature-box">
              <div className="feature-icon-wrapper">
                {getFeatureIcon(feat.icon)}
              </div>
              <div className="feature-info">
                <h4>{feat.title}</h4>
                <p>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Deals Grid (Ala Vapehan) */}
      <section className="container promo-deals-section">
        <div className="promo-deals-grid">
          {PROMO_DEALS.map((deal) => (
            <div
              key={deal.id}
              className={`promo-deal-card theme-${deal.theme}`}
              onClick={() => {
                setSelectedCategory(deal.categoryTarget);
                document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="promo-deal-content">
                <div className="promo-deal-tag">{deal.tag}</div>
                <h3 className="promo-deal-title">{deal.title}</h3>
                <p className="promo-deal-desc">{deal.description}</p>
                <span className="promo-deal-btn">
                  Belanja {deal.productCount} <ChevronRight size={14} />
                </span>
              </div>
              <div className="promo-deal-visual">
                <div className={`promo-deal-badge badge-${deal.theme}`}>{deal.discountBadge}</div>
                <img src={deal.image} alt={deal.title} className="promo-deal-img" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Showcase Section */}
      <section id="featured-products" className="container">
        <div className="section-header">
          <div className="section-header-title">
            <span className="section-tag">CATALOG PILIHAN</span>
            <h2 className="section-title">
              {selectedCategory === 'all' 
                ? 'Semua Produk Pilihan' 
                : CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
          </div>
          <div className="filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-toolbar">
          <div className="toolbar-group-left">
            <div className="filter-select-box">
              <Tag size={14} />
              <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
                {BRANDS.map((b) => (
                  <option key={b} value={b === 'Semua Brand' ? 'all' : b}>{b}</option>
                ))}
              </select>
            </div>
            <button
              className={`btn-toggle-discount ${onlyDiscount ? 'active' : ''}`}
              onClick={() => setOnlyDiscount(!onlyDiscount)}
            >
              <Percent size={14} /> Diskon ≥ 15%
            </button>
          </div>
          <div className="toolbar-group-right">
            <span className="catalog-results-count">{filteredProducts.length} produk</span>
            <div className="filter-select-box">
              <ArrowUpDown size={14} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Urutkan: Default</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="reviews">Paling Laris</option>
              </select>
            </div>
            {hasActiveFilter && (
              <button className="btn-reset-filters" onClick={resetFilters}>
                <X size={12} /> Reset
              </button>
            )}
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
            {filteredProducts.map((product) => (
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
                        <span style={{ fontWeight: '700', color: '#fff' }}>{product.rating}</span>
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
                  </div>
                </a>

                <div className="product-info product-info-actions">
                  <button className="btn-add-cart" onClick={() => addToCart(product)}>
                    <Plus size={16} /> Beli
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
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
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                >
                  Lanjut ke Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="detail-modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={18} />
            </button>
            <div className="detail-modal-gallery">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>
            <div className="detail-modal-content">
              <span className="product-brand" style={{ marginBottom: '8px' }}>
                {selectedProduct.brand}
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>
                {selectedProduct.name}
              </h2>
              <div className="product-rating" style={{ marginBottom: '16px' }}>
                <div className="rating-stars">
                  <Star size={16} fill="currentColor" />
                  <span style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>
                    {selectedProduct.rating}
                  </span>
                </div>
                <span className="rating-count">({selectedProduct.reviewsCount} customer reviews)</span>
              </div>
              <div className="product-price-row" style={{ marginBottom: '20px' }}>
                <div className="product-price" style={{ fontSize: '24px' }}>
                  {formatRupiah(selectedProduct.price)}
                </div>
                {selectedProduct.originalPrice && (
                  <div className="product-price-original" style={{ fontSize: '15px' }}>
                    {formatRupiah(selectedProduct.originalPrice)}
                  </div>
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                {selectedProduct.description}
              </p>
              {selectedProduct.features && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Fitur & Spesifikasi:
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedProduct.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#fff' }}>
                        <Check size={14} color="var(--primary-red)" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingBag size={18} /> Tambah ke Keranjang
                </button>
              </div>
            </div>
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
              <h4 className="footer-heading">Layanan & Garansi</h4>
              <ul className="footer-links">
                <li><a href="#">Cek Keaslian Produk</a></li>
                <li><a href="#">Ketentuan Retur & Garansi</a></li>
                <li><a href="#">Pengiriman Instant / Sameday</a></li>
                <li><a href="#">FAQ & Pertanyaan Umum</a></li>
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
              © 2026 Rumah Tua Vape (RTV). Hak cipta dilindungi undang-undang.
            </div>
            <div>
              Peringatan: Produk ini mengandung nikotin. Hanya untuk 21+ tahun.
            </div>
          </div>
        </div>
      </footer>
      </>
      )}
    </div>
  );
}
