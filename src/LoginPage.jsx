import React, { useState, useEffect } from 'react';
import { 
  Lock, Mail, Phone, Eye, EyeOff, ShieldCheck, ArrowLeft, 
  KeyRound, CheckCircle2, AlertCircle, Award, Truck, Heart, 
  User, Sliders, MapPin, Check
} from 'lucide-react';
import { authService, INITIAL_DEMO_USER } from './data/authService';
import { STORE_INFO } from './data/products';
import './LoginPage.css';

export default function LoginPage({ onLoginSuccess, onBackToHome, redirectReason }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [ageConsent, setAgeConsent] = useState(false);

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // R-32 Keyboard Accessibility: Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showForgotModal) {
        setShowForgotModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForgotModal]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('Silakan masukkan email atau nomor WhatsApp.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Silakan masukkan kata sandi akun.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = authService.login(loginIdentifier.trim(), loginPassword, rememberMe);
      setSuccessMsg(`Login berhasil. Selamat datang kembali, ${user.name}.`);
      setTimeout(() => {
        onLoginSuccess?.(user);
      }, 500);
    }, 450);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!registerName.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }
    if (!registerEmail.includes('@')) {
      setErrorMsg('Format alamat email tidak valid.');
      return;
    }
    if (!registerPhone.trim()) {
      setErrorMsg('Nomor WhatsApp wajib diisi untuk verifikasi pesanan.');
      return;
    }
    if (registerPassword.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak sesuai.');
      return;
    }
    if (!ageConsent) {
      setErrorMsg('Konfirmasi usia 21 tahun ke atas wajib dicentang.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser = authService.register({
        name: registerName.trim(),
        email: registerEmail.trim(),
        phone: registerPhone.trim()
      });
      setSuccessMsg(`Pendaftaran berhasil. Selamat bergabung di RTV, ${newUser.name}.`);
      setTimeout(() => {
        onLoginSuccess?.(newUser);
      }, 600);
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoUser = authService.loginDemoUser();
      setSuccessMsg(`Masuk sebagai akun demo: ${demoUser.name}`);
      setTimeout(() => {
        onLoginSuccess?.(demoUser);
      }, 400);
    }, 300);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      return;
    }
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Navigation Breadcrumb */}
        <div className="login-header-nav">
          <button onClick={onBackToHome} className="login-back-btn">
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {/* Redirect Notice if routed from Checkout */}
        {redirectReason === 'checkout' && (
          <div className="login-alert-banner" role="alert">
            <AlertCircle size={20} color="var(--primary-red)" />
            <div>
              <strong>Login Diperlukan Sebelum Checkout</strong>
              <p>Masuk ke akun Anda atau daftar baru untuk melanjutkan konfirmasi pesanan.</p>
            </div>
          </div>
        )}

        <div className="login-card-wrapper">
          {/* Main Form Card */}
          <div className="login-main-card">
            <div className="login-brand-header">
              <div className="login-logo-circle">
                <img src="/images/logo.webp" alt="Rumah Tua Vape Logo" />
              </div>
              <h1>RUMAH TUA <span>VAPE</span></h1>
              <p className="login-subtitle">Portal Akun Member & Pembeli Terdaftar</p>
              <div className="login-notice-bar">
                <ShieldCheck size={15} />
                <span>Khusus Usia 21+ · Penjualan Produk Terverifikasi</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="login-tabs" role="tablist">
              <button 
                type="button" 
                role="tab"
                aria-selected={activeTab === 'login'}
                className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
              >
                Masuk ke Akun
              </button>
              <button 
                type="button" 
                role="tab"
                aria-selected={activeTab === 'register'}
                className={`login-tab ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
              >
                Daftar Baru
              </button>
            </div>

            {/* Quick Demo Access */}
            <div className="quick-demo-box">
              <div className="quick-demo-info">
                <KeyRound size={17} className="quick-demo-icon" />
                <div>
                  <strong>Akses Cepat Pengujian</strong>
                  <span>Gunakan akun demo untuk melihat dashboard member langsung</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleQuickDemoLogin}
                className="btn-quick-demo"
                disabled={isLoading}
              >
                Masuk Cepat ({INITIAL_DEMO_USER.name})
              </button>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="auth-alert error" role="alert">
                <AlertCircle size={17} />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="auth-alert success" role="status">
                <Check size={17} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
                <div className="form-group">
                  <label htmlFor="login-id">Email atau Nomor WhatsApp</label>
                  <div className="input-with-icon">
                    <Mail size={17} className="input-icon" aria-hidden="true" />
                    <input 
                      id="login-id"
                      type="text"
                      placeholder="farhan@rumahtuavape.com atau 081298765432"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="label-with-action">
                    <label htmlFor="login-pass">Kata Sandi</label>
                    <button 
                      type="button" 
                      className="link-btn-small" 
                      onClick={() => setShowForgotModal(true)}
                    >
                      Lupa kata sandi?
                    </button>
                  </div>
                  <div className="input-with-icon">
                    <Lock size={17} className="input-icon" aria-hidden="true" />
                    <input 
                      id="login-pass"
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="Masukkan kata sandi"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="btn-toggle-eye"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                    >
                      {showLoginPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className="form-row-checkbox">
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkbox-text">Tetap masuk di perangkat ini</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn-auth-submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Memverifikasi...' : 'Masuk Sekarang'}
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="auth-form" noValidate>
                <div className="form-group">
                  <label htmlFor="reg-name">Nama Lengkap</label>
                  <div className="input-with-icon">
                    <User size={17} className="input-icon" aria-hidden="true" />
                    <input 
                      id="reg-name"
                      type="text"
                      placeholder="Nama lengkap Anda"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-email">Alamat Email</label>
                  <div className="input-with-icon">
                    <Mail size={17} className="input-icon" aria-hidden="true" />
                    <input 
                      id="reg-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-phone">Nomor WhatsApp Aktif</label>
                  <div className="input-with-icon">
                    <Phone size={17} className="input-icon" aria-hidden="true" />
                    <input 
                      id="reg-phone"
                      type="tel"
                      placeholder="0812xxxxxxxx"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label htmlFor="reg-pass">Kata Sandi</label>
                    <div className="input-with-icon">
                      <Lock size={17} className="input-icon" aria-hidden="true" />
                      <input 
                        id="reg-pass"
                        type={showRegisterPassword ? 'text' : 'password'}
                        placeholder="Minimal 6 karakter"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-confirm">Ulangi Sandi</label>
                    <div className="input-with-icon">
                      <Lock size={17} className="input-icon" aria-hidden="true" />
                      <input 
                        id="reg-confirm"
                        type={showRegisterPassword ? 'text' : 'password'}
                        placeholder="Konfirmasi sandi"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn-toggle-eye-inline"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                >
                  {showRegisterPassword ? 'Sembunyikan karakter sandi' : 'Periksa karakter sandi'}
                </button>

                <div className="form-row-checkbox">
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={ageConsent}
                      onChange={(e) => setAgeConsent(e.target.checked)}
                      required
                    />
                    <span className="checkbox-text">
                      Saya mengonfirmasi berusia <strong>21 tahun ke atas</strong> dan menyetujui kebijakan layanan toko.
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn-auth-submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Mendaftarkan...' : 'Daftar Akun Member'}
                </button>
              </form>
            )}

            <div className="auth-footer-disclaimer">
              <ShieldCheck size={15} />
              <span>Data akun tersimpan lokal dan terlindungi untuk kemudahan transaksi.</span>
            </div>
          </div>

          {/* Side Info Perks Card */}
          <div className="login-side-perks">
            <span className="perks-heading-label">LAYANAN MEMBER</span>
            <h2>Fasilitas Akun Rumah Tua Vape</h2>
            <p className="perks-lead">
              Pusat pengelolaan pesanan, catatan alamat pengiriman, dan riwayat transaksi resmi.
            </p>

            <div className="perk-items">
              <div className="perk-item">
                <div className="perk-icon-wrap">
                  <Award size={18} />
                </div>
                <div>
                  <strong>Poin dan Potongan Belanja</strong>
                  <p>Kumpulkan poin reward dari setiap pesanan yang dapat ditukarkan potongan harga.</p>
                </div>
              </div>

              <div className="perk-item">
                <div className="perk-icon-wrap">
                  <Truck size={18} />
                </div>
                <div>
                  <strong>Pelacakan Status dan Resi</strong>
                  <p>Pantau status ekspedisi J&T, SiCepat, atau kurir instant secara terperinci.</p>
                </div>
              </div>

              <div className="perk-item">
                <div className="perk-icon-wrap">
                  <Heart size={18} />
                </div>
                <div>
                  <strong>Daftar Keinginan (Wishlist)</strong>
                  <p>Simpan device, coil, dan liquid favorit agar mudah dibeli kembali.</p>
                </div>
              </div>

              <div className="perk-item">
                <div className="perk-icon-wrap">
                  <Sliders size={18} />
                </div>
                <div>
                  <strong>Preferensi Vaping Personal</strong>
                  <p>Simpan tipe perangkat dan jenis liquid favorit untuk rekomendasi yang tepat.</p>
                </div>
              </div>
            </div>

            {/* Real Store Verification Card (Replaces AI fake quote) */}
            <div className="perks-store-card">
              <strong>Lounge & Store Fisik RTV</strong>
              <p>Mendukung konsultasi langsung, coiling service, dan pengujian keaslian produk.</p>
              <div className="perks-store-address">
                <MapPin size={15} />
                <span>{STORE_INFO.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)} role="dialog" aria-modal="true">
          <div className="modal-card auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-badge">
              <Lock size={22} />
            </div>
            <h2>Pemulihan Kata Sandi</h2>
            <p>Masukkan alamat email akun yang terdaftar untuk menerima petunjuk reset.</p>
            
            {forgotSuccess ? (
              <div className="auth-alert success" role="status">
                <Check size={16} />
                <span>Tautan pemulihan berhasil dikirim ke <strong>{forgotEmail}</strong>.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <input 
                  type="email" 
                  placeholder="nama@email.com" 
                  value={forgotEmail} 
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="auth-modal-input"
                  required 
                />
                <div className="modal-actions" style={{ marginTop: '16px' }}>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setShowForgotModal(false)}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={!forgotEmail.includes('@')}
                  >
                    Kirim Instruksi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
