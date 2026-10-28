import React, { useState, useEffect } from 'react';
import { 
  User, Package, MapPin, Heart, Tag, Settings, LogOut, 
  CheckCircle2, Truck, ShieldCheck, ChevronRight, Copy, 
  Award, ShoppingBag, ArrowLeft, Phone, Mail, Calendar, 
  Edit3, RefreshCw, X, Coins, Check
} from 'lucide-react';
import { authService, AVAILABLE_COUPONS } from './data/authService';
import './ProfilePage.css';

export default function ProfilePage({
  user,
  wishlist = [],
  products = [],
  onUpdateUser,
  onLogout,
  onAddToCart,
  onToggleWishlist,
  formatRupiah,
  whatsapp,
  onNavigateToHome,
  defaultTab = 'overview'
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || 'overview');
  const [orders] = useState(() => authService.getOrderHistory());
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    deviceType: user?.vapePreference?.deviceType || 'Pod System',
    liquidType: user?.vapePreference?.liquidType || 'Saltnic',
    favoriteFlavour: user?.vapePreference?.favoriteFlavour || 'Fruity Mint / Ice',
    nicotineLevel: user?.vapePreference?.nicotineLevel || '30mg'
  });

  // R-32 Keyboard Accessibility: Close modals with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedInvoice) setSelectedInvoice(null);
        if (showLogoutConfirm) setShowLogoutConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInvoice, showLogoutConfirm]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Kode promo "${code}" berhasil disalin`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      address: editForm.address,
      city: editForm.city,
      postalCode: editForm.postalCode,
      vapePreference: {
        deviceType: editForm.deviceType,
        liquidType: editForm.liquidType,
        favoriteFlavour: editForm.favoriteFlavour,
        nicotineLevel: editForm.nicotineLevel
      }
    };
    const saved = authService.updateProfile(updated);
    onUpdateUser?.(saved);
    showToast('Profil dan alamat berhasil diperbarui');
  };

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        onAddToCart?.(item, item.quantity || 1);
      });
      showToast(`${order.items.length} item dimasukkan ke keranjang`);
    }
  };

  const getWaHelpLink = (orderId) => {
    const targetNumber = (whatsapp || '6281234567890').replace(/[^0-9]/g, '');
    const text = `Halo Admin Rumah Tua Vape, saya ingin menanyakan status pesanan saya dengan nomor: ${orderId}. Terima kasih.`;
    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'shipping') return o.status === 'Sedang Dikirim' || o.status === 'Diproses';
    if (orderFilter === 'completed') return o.status === 'Selesai';
    return true;
  });

  const latestOrder = orders.length > 0 ? orders[0] : null;

  const getInitials = (name) => {
    if (!name) return 'RT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="profile-page">
      {/* Toast Alert without slop colored stripe */}
      {toastMessage && (
        <div className="profile-toast" role="status">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="profile-container">
        {/* Navigation Breadcrumb */}
        <div className="profile-nav-header">
          <button onClick={onNavigateToHome} className="profile-back-link">
            <ArrowLeft size={15} />
            <span>Katalog Produk</span>
          </button>
          <span className="profile-breadcrumb-sep">/</span>
          <span className="profile-breadcrumb-active">Akun Member</span>
        </div>

        {/* Top Profile Banner Card - grounded dark finish without radial orb */}
        <div className="profile-hero-card">
          <div className="profile-hero-content">
            <div className="profile-avatar-box">
              <div className="profile-avatar-letters" aria-hidden="true">
                {getInitials(user?.name)}
              </div>
            </div>

            <div className="profile-user-info">
              <div className="profile-name-row">
                <h1>{user?.name || 'Farhan Putra'}</h1>
              </div>
              
              <div className="profile-meta-tags">
                <span className="profile-meta-item">
                  <Mail size={13} /> {user?.email || 'member@rtv.id'}
                </span>
                <span className="profile-meta-item">
                  <Phone size={13} /> {user?.phone || '0812-xxxx-xxxx'}
                </span>
                <span className="profile-meta-item">
                  <Calendar size={13} /> Bergabung {user?.memberSince || '2025'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            <div className="profile-points-pill">
              <Coins size={16} className="points-icon" />
              <div>
                <span className="points-label">Poin Member</span>
                <strong className="points-value">{user?.points || 380} Pts</strong>
              </div>
            </div>

            <button 
              className="btn-profile-logout"
              onClick={() => setShowLogoutConfirm(true)}
              title="Keluar dari akun"
            >
              <LogOut size={15} />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Profile Content Layout */}
        <div className="profile-layout-grid">
          {/* Left Navigation Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-nav-menu" role="tablist">
              <button 
                role="tab"
                aria-selected={activeTab === 'overview'}
                className={`profile-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <User size={16} />
                <span>Ringkasan Akun</span>
                <ChevronRight size={15} className="menu-arrow" />
              </button>

              <button 
                role="tab"
                aria-selected={activeTab === 'orders'}
                className={`profile-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Package size={16} />
                <span>Riwayat Pesanan</span>
                {orders.length > 0 && <span className="menu-badge">{orders.length}</span>}
                <ChevronRight size={15} className="menu-arrow" />
              </button>

              <button 
                role="tab"
                aria-selected={activeTab === 'settings'}
                className={`profile-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={16} />
                <span>Alamat & Preferensi</span>
                <ChevronRight size={15} className="menu-arrow" />
              </button>

              <button 
                role="tab"
                aria-selected={activeTab === 'wishlist'}
                className={`profile-menu-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <Heart size={16} />
                <span>Wishlist Saya</span>
                {wishlist.length > 0 && <span className="menu-badge">{wishlist.length}</span>}
                <ChevronRight size={15} className="menu-arrow" />
              </button>

              <button 
                role="tab"
                aria-selected={activeTab === 'coupons'}
                className={`profile-menu-item ${activeTab === 'coupons' ? 'active' : ''}`}
                onClick={() => setActiveTab('coupons')}
              >
                <Tag size={16} />
                <span>Voucher Belanja</span>
                <span className="menu-badge">3</span>
                <ChevronRight size={15} className="menu-arrow" />
              </button>
            </div>

          </aside>

          {/* Right Main Panel */}
          <main className="profile-main-content">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="tab-pane-fade">
                {/* 4 Stat Cards - Clean unified monochromatic look without pastel circus */}
                <div className="profile-stats-grid">
                  <div className="stat-card" onClick={() => setActiveTab('orders')} role="button" tabIndex={0}>
                    <div className="stat-icon-wrap">
                      <Package size={18} />
                    </div>
                    <div>
                      <span className="stat-label">Total Pesanan</span>
                      <strong className="stat-num">{orders.length}</strong>
                    </div>
                  </div>

                  <div className="stat-card" onClick={() => setActiveTab('wishlist')} role="button" tabIndex={0}>
                    <div className="stat-icon-wrap">
                      <Heart size={18} />
                    </div>
                    <div>
                      <span className="stat-label">Wishlist</span>
                      <strong className="stat-num">{wishlist.length}</strong>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrap">
                      <Coins size={18} />
                    </div>
                    <div>
                      <span className="stat-label">Poin Member</span>
                      <strong className="stat-num">{user?.points || 380} Pts</strong>
                    </div>
                  </div>

                  <div className="stat-card" onClick={() => setActiveTab('coupons')} role="button" tabIndex={0}>
                    <div className="stat-icon-wrap">
                      <Tag size={18} />
                    </div>
                    <div>
                      <span className="stat-label">Voucher Aktif</span>
                      <strong className="stat-num">3 Siap Pakai</strong>
                    </div>
                  </div>
                </div>

                {/* Latest Order Snapshot */}
                <div className="profile-section-card">
                  <div className="section-card-header">
                    <div>
                      <h2>Pesanan Terakhir</h2>
                      <p>Status terkini pengiriman pesanan Anda</p>
                    </div>
                    <button 
                      className="link-btn-clean"
                      onClick={() => setActiveTab('orders')}
                    >
                      Lihat Semua Riwayat
                    </button>
                  </div>

                  {latestOrder ? (
                    <div className="latest-order-card">
                      <div className="order-summary-row">
                        <div className="order-id-meta">
                          <span className="order-id-label">Nomor:</span>
                          <strong>{latestOrder.orderId}</strong>
                          <span className="order-date-text">{latestOrder.createdAt}</span>
                        </div>
                        <div className={`status-pill ${latestOrder.status === 'Selesai' ? 'completed' : 'shipping'}`}>
                          {latestOrder.status === 'Selesai' ? <CheckCircle2 size={13} /> : <Truck size={13} />}
                          <span>{latestOrder.status}</span>
                        </div>
                      </div>

                      <div className="latest-order-items">
                        {latestOrder.items?.map((item, idx) => (
                          <div key={idx} className="latest-order-item-row">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="item-thumb" />
                            )}
                            <div className="item-info">
                              <span className="item-name">{item.name}</span>
                              <span className="item-qty-price">{item.quantity} x {formatRupiah(item.price)}</span>
                            </div>
                            <strong className="item-subtotal">
                              {formatRupiah((item.price || 0) * (item.quantity || 1))}
                            </strong>
                          </div>
                        ))}
                      </div>

                      <div className="order-footer-details">
                        <div className="tracking-info">
                          <span>Ekspedisi dan Resi Pengiriman:</span>
                          <strong>{latestOrder.courier} · {latestOrder.trackingNumber || 'Proses Pengepakan'}</strong>
                        </div>
                        <div className="order-actions">
                          <button 
                            className="btn-order-secondary"
                            onClick={() => setSelectedInvoice(latestOrder)}
                          >
                            Detail Nota
                          </button>
                          <a 
                            href={getWaHelpLink(latestOrder.orderId)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-order-primary"
                          >
                            Tanya Admin
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state-box">
                      <Package size={36} className="empty-icon" />
                      <p>Belum ada riwayat pesanan tercatat.</p>
                      <button onClick={onNavigateToHome} className="btn-primary" style={{ marginTop: '10px' }}>
                        Mulai Belanja
                      </button>
                    </div>
                  )}
                </div>

                {/* Vaping Setup Preference Card */}
                <div className="profile-section-card">
                  <div className="section-card-header">
                    <div>
                      <h2>Preferensi Setup Vaping</h2>
                      <p>Digunakan untuk penyesuaian rekomendasi produk dan kecocokan coil</p>
                    </div>
                    <button 
                      className="link-btn-clean"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Edit3 size={13} /> Ubah Preferensi
                    </button>
                  </div>

                  <div className="preference-tags-grid">
                    <div className="pref-tag-card">
                      <span className="pref-title">Tipe Perangkat</span>
                      <strong>{user?.vapePreference?.deviceType || 'Pod System'}</strong>
                    </div>
                    <div className="pref-tag-card">
                      <span className="pref-title">Jenis Liquid</span>
                      <strong>{user?.vapePreference?.liquidType || 'Saltnic'}</strong>
                    </div>
                    <div className="pref-tag-card">
                      <span className="pref-title">Profil Rasa</span>
                      <strong>{user?.vapePreference?.favoriteFlavour || 'Fruity Mint / Ice'}</strong>
                    </div>
                    <div className="pref-tag-card">
                      <span className="pref-title">Kadar Nikotin</span>
                      <strong>{user?.vapePreference?.nicotineLevel || '30mg'}</strong>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Snapshot */}
                <div className="profile-section-card">
                  <div className="section-card-header">
                    <div>
                      <h2>Alamat Pengiriman Utama</h2>
                      <p>Otomatis terisi saat Anda melakukan checkout di toko</p>
                    </div>
                    <button 
                      className="link-btn-clean"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Edit3 size={13} /> Edit Alamat
                    </button>
                  </div>

                  <div className="address-snapshot-box">
                    <MapPin size={20} className="address-pin-icon" />
                    <div>
                      <strong>{user?.name || 'Farhan Putra'} ({user?.phone || '0812-9876-5432'})</strong>
                      <p>{user?.address || 'Belum ada alamat pengiriman tersimpan.'}</p>
                      <small>{user?.city ? `${user.city}, ${user.postalCode || ''}` : 'Kota belum ditentukan'}</small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div className="tab-pane-fade">
                <div className="orders-header-bar">
                  <div>
                    <h2>Riwayat Pesanan</h2>
                    <p>Daftar seluruh transaksi dan status pengiriman barang Anda</p>
                  </div>

                  <div className="order-filter-pills" role="group" aria-label="Filter status pesanan">
                    <button 
                      className={`order-pill ${orderFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('all')}
                    >
                      Semua ({orders.length})
                    </button>
                    <button 
                      className={`order-pill ${orderFilter === 'shipping' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('shipping')}
                    >
                      Dalam Pengiriman
                    </button>
                    <button 
                      className={`order-pill ${orderFilter === 'completed' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('completed')}
                    >
                      Selesai
                    </button>
                  </div>
                </div>

                {filteredOrders.length > 0 ? (
                  <div className="orders-card-list">
                    {filteredOrders.map((order, index) => (
                      <div key={order.orderId || index} className="order-full-card">
                        <div className="order-full-header">
                          <div className="order-header-left">
                            <span className="order-tag">PESANAN</span>
                            <strong>{order.orderId}</strong>
                            <span className="order-time">{order.createdAt}</span>
                          </div>
                          <div className={`status-pill ${order.status === 'Selesai' ? 'completed' : 'shipping'}`}>
                            {order.status === 'Selesai' ? <CheckCircle2 size={13} /> : <Truck size={13} />}
                            <span>{order.status}</span>
                          </div>
                        </div>

                        <div className="order-full-body">
                          <div className="order-items-list">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="order-item-detail">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="item-img" />
                                ) : (
                                  <div className="item-img-placeholder"><ShoppingBag size={16} /></div>
                                )}
                                <div className="item-desc">
                                  <h4>{item.name}</h4>
                                  <span>{item.quantity} barang x {formatRupiah(item.price)}</span>
                                </div>
                                <div className="item-price">
                                  {formatRupiah((item.price || 0) * (item.quantity || 1))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="order-meta-info-grid">
                            <div>
                              <span>Ekspedisi Pengiriman</span>
                              <strong>{order.courier}</strong>
                              <small>Resi: {order.trackingNumber || 'Proses Pengepakan'}</small>
                            </div>
                            <div>
                              <span>Metode Pembayaran</span>
                              <strong>{order.payment}</strong>
                            </div>
                            <div className="order-total-col">
                              <span>Total Pembayaran</span>
                              <strong className="grand-total-highlight">
                                {formatRupiah(order.grandTotal || order.subtotal)}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="order-full-footer">
                          <button 
                            className="btn-order-action secondary"
                            onClick={() => setSelectedInvoice(order)}
                          >
                            Rincian Nota
                          </button>
                          <button 
                            className="btn-order-action secondary"
                            onClick={() => handleReorder(order)}
                          >
                            <RefreshCw size={13} /> Pesan Lagi
                          </button>
                          <a 
                            href={getWaHelpLink(order.orderId)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-order-action primary"
                          >
                            Konfirmasi WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-box">
                    <Package size={42} className="empty-icon" />
                    <h3>Tidak Ada Pesanan</h3>
                    <p>Pesanan yang Anda buat akan muncul di sini beserta nomor resi pengiriman.</p>
                    <button onClick={onNavigateToHome} className="btn-primary" style={{ marginTop: '16px' }}>
                      Buka Katalog
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SETTINGS & ADDRESS */}
            {activeTab === 'settings' && (
              <div className="tab-pane-fade">
                <div className="section-card-header" style={{ marginBottom: '20px' }}>
                  <div>
                    <h2>Alamat Pengiriman & Preferensi</h2>
                    <p>Pastikan data alamat akurat untuk ketepatan pengiriman kurir</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="profile-edit-form">
                  {/* Personal Information */}
                  <div className="form-card-block">
                    <h3>Data Diri</h3>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="pf-name">Nama Lengkap</label>
                        <input 
                          id="pf-name"
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="pf-email">Email Akun</label>
                        <input 
                          id="pf-email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="pf-phone">Nomor WhatsApp (Aktif untuk Konfirmasi Resi)</label>
                      <input 
                        id="pf-phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="form-card-block">
                    <h3>Alamat Penerima Paket</h3>
                    <div className="form-group">
                      <label htmlFor="pf-address">Alamat Lengkap (Jalan, RT/RW, Nomor, Patokan)</label>
                      <textarea 
                        id="pf-address"
                        rows={3}
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        placeholder="Contoh: Jl. Bangka Raya No. 12, Pela Mampang (Pagar Hitam)"
                        required
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="pf-city">Kota / Kabupaten</label>
                        <input 
                          id="pf-city"
                          type="text"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          placeholder="Jakarta Selatan"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="pf-pos">Kode Pos</label>
                        <input 
                          id="pf-pos"
                          type="text"
                          value={editForm.postalCode}
                          onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                          placeholder="12720"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vaping Preferences */}
                  <div className="form-card-block">
                    <h3>Preferensi Perangkat dan Liquid</h3>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="pf-dev">Tipe Perangkat Favorit</label>
                        <select 
                          id="pf-dev"
                          value={editForm.deviceType}
                          onChange={(e) => setEditForm({ ...editForm, deviceType: e.target.value })}
                        >
                          <option value="Pod System">Pod System (Simple & Ringkas)</option>
                          <option value="Box Mod / Dual Battery">Box Mod (Power & Awan Tebal)</option>
                          <option value="AIO (All-in-One)">AIO / Boro System</option>
                          <option value="Disposable Pod">Disposable Pod</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="pf-liq">Jenis Liquid Pilihan</label>
                        <select 
                          id="pf-liq"
                          value={editForm.liquidType}
                          onChange={(e) => setEditForm({ ...editForm, liquidType: e.target.value })}
                        >
                          <option value="Saltnic">Saltnic (Halus & Cepat Serap)</option>
                          <option value="Freebase">Freebase (Throat Hit Jelas)</option>
                          <option value="Pods Friendly">Pods Friendly (Hybrid)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="pf-flavor">Profil Rasa</label>
                        <select 
                          id="pf-flavor"
                          value={editForm.favoriteFlavour}
                          onChange={(e) => setEditForm({ ...editForm, favoriteFlavour: e.target.value })}
                        >
                          <option value="Fruity Mint / Ice">Fruity Dingin / Ice</option>
                          <option value="Creamy / Dessert">Creamy / Dessert (Kue, Kopi, Susu)</option>
                          <option value="Authentic Tobacco">Tobacco / Cerutu Klasik</option>
                          <option value="Beverage / Soda">Beverage / Minuman</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="pf-nic">Level Nikotin</label>
                        <select 
                          id="pf-nic"
                          value={editForm.nicotineLevel}
                          onChange={(e) => setEditForm({ ...editForm, nicotineLevel: e.target.value })}
                        >
                          <option value="3mg">3mg (Freebase Ringan)</option>
                          <option value="6mg">6mg (Freebase Sedang)</option>
                          <option value="9mg / 12mg">9mg / 12mg (Freebase Bold)</option>
                          <option value="25mg - 30mg">25mg - 30mg (Standard Saltnic)</option>
                          <option value="50mg">50mg (Strong Saltnic)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-submit-row">
                    <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 4: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="tab-pane-fade">
                <div className="section-card-header" style={{ marginBottom: '20px' }}>
                  <div>
                    <h2>Wishlist Produk</h2>
                    <p>Produk yang Anda simpan untuk dibeli nanti</p>
                  </div>
                </div>

                {wishlistedProducts.length > 0 ? (
                  <div className="wishlist-products-grid">
                    {wishlistedProducts.map((product) => (
                      <div key={product.id} className="wishlist-item-card">
                        <div className="wishlist-item-image">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="wishlist-item-content">
                          <span className="wishlist-item-brand">{product.brand}</span>
                          <h3 className="wishlist-item-title">{product.name}</h3>
                          <div className="wishlist-item-price">
                            <strong>{formatRupiah(product.price)}</strong>
                          </div>

                          <div className="wishlist-item-actions">
                            <button 
                              className="btn-wishlist-cart"
                              onClick={() => {
                                onAddToCart?.(product, 1);
                                showToast(`${product.name.slice(0, 24)}... masuk keranjang`);
                              }}
                            >
                              <ShoppingBag size={14} /> Tambah ke Keranjang
                            </button>
                            <button 
                              className="btn-wishlist-remove"
                              onClick={() => {
                                onToggleWishlist?.(product.id);
                                showToast('Dihapus dari wishlist');
                              }}
                              title="Hapus dari wishlist"
                              aria-label="Hapus produk dari wishlist"
                            >
                              <Heart size={15} fill="var(--primary-red)" color="var(--primary-red)" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-box">
                    <Heart size={40} className="empty-icon" />
                    <h3>Wishlist Belum Terisi</h3>
                    <p>Tekan ikon hati pada produk di katalog untuk menyimpannya di sini.</p>
                    <button onClick={onNavigateToHome} className="btn-primary" style={{ marginTop: '16px' }}>
                      Buka Katalog Produk
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: COUPONS */}
            {activeTab === 'coupons' && (
              <div className="tab-pane-fade">
                <div className="section-card-header" style={{ marginBottom: '20px' }}>
                  <div>
                    <h2>Voucher Member RTV</h2>
                    <p>Salin kode voucher dan gunakan saat melakukan pesanan</p>
                  </div>
                </div>

                <div className="coupons-grid">
                  {AVAILABLE_COUPONS.map((coupon) => (
                    <div key={coupon.code} className="coupon-card">
                      <div className="coupon-left">
                        <div className="coupon-badge">VOUCHER</div>
                        <h3 className="coupon-discount">{coupon.discount}</h3>
                        <p className="coupon-title">{coupon.title}</p>
                        <span className="coupon-terms">{coupon.minSpend} · {coupon.expiry}</span>
                      </div>

                      <div className="coupon-right">
                        <div className="coupon-code-pill">
                          <code>{coupon.code}</code>
                        </div>
                        <button 
                          className={`btn-copy-code ${copiedCode === coupon.code ? 'copied' : ''}`}
                          onClick={() => handleCopyCode(coupon.code)}
                          aria-label={`Salin kode ${coupon.code}`}
                        >
                          <Copy size={12} />
                          {copiedCode === coupon.code ? 'Tersalin' : 'Salin Kode'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Points exchange without magic Sparkles glyph */}
                <div className="points-exchange-card">
                  <div className="exchange-left">
                    <Coins size={24} color="var(--primary-red)" />
                    <div>
                      <h3>Poin Member Tersedia ({user?.points || 380} Pts)</h3>
                      <p>Tukarkan kelipatan 100 poin untuk potongan Rp 10.000 saat transaksi di lounge atau WhatsApp.</p>
                    </div>
                  </div>
                  <a 
                    href={`https://wa.me/${(whatsapp || '6281234567890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo Admin RTV, saya ingin menukar poin member saya (${user?.points || 380} poin) untuk diskon pesanan.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Tukar via CS
                  </a>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Invoice Detail Modal with Escape handler */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)} role="dialog" aria-modal="true">
          <div className="modal-card invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-header">
              <div className="invoice-title">
                <h2>Rincian Nota Pesanan</h2>
                <span>ID: {selectedInvoice.orderId}</span>
              </div>
              <button 
                className="invoice-close" 
                onClick={() => setSelectedInvoice(null)}
                aria-label="Tutup Nota"
              >
                <X size={18} />
              </button>
            </div>

            <div className="invoice-body">
              <div className="invoice-meta-row">
                <div>
                  <small>Waktu Pemesanan</small>
                  <strong>{selectedInvoice.createdAt}</strong>
                </div>
                <div>
                  <small>Status</small>
                  <strong>{selectedInvoice.status}</strong>
                </div>
                <div>
                  <small>Ekspedisi</small>
                  <strong>{selectedInvoice.courier}</strong>
                </div>
              </div>

              <div className="invoice-dest">
                <small>Tujuan Pengiriman</small>
                <strong>{selectedInvoice.name} ({selectedInvoice.phone})</strong>
                <p>{selectedInvoice.address}</p>
              </div>

              <div className="invoice-items-table">
                {selectedInvoice.items?.map((item, idx) => (
                  <div key={idx} className="invoice-item-row">
                    <span>{item.name} x {item.quantity}</span>
                    <strong>{formatRupiah((item.price || 0) * (item.quantity || 1))}</strong>
                  </div>
                ))}
              </div>

              <div className="invoice-summary-calc">
                <div className="calc-row">
                  <span>Subtotal Produk</span>
                  <span>{formatRupiah(selectedInvoice.subtotal)}</span>
                </div>
                <div className="calc-row">
                  <span>Ongkos Kirim</span>
                  <span>{formatRupiah(selectedInvoice.shippingCost || 12000)}</span>
                </div>
                <div className="calc-row grand-total">
                  <strong>Total Pembayaran</strong>
                  <strong>{formatRupiah(selectedInvoice.grandTotal || selectedInvoice.subtotal)}</strong>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button className="btn-secondary" onClick={() => setSelectedInvoice(null)}>
                Tutup Nota
              </button>
              <a 
                href={getWaHelpLink(selectedInvoice.orderId)}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Konfirmasi WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal with Escape handler */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)} role="dialog" aria-modal="true">
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-badge">
              <LogOut size={22} />
            </div>
            <h2>Keluar dari Akun?</h2>
            <p>Anda dapat masuk kembali kapan saja untuk mengakses poin dan memantau pesanan Anda.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowLogoutConfirm(false)}>
                Batal
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout?.();
                }}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
