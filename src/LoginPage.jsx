import React, { useState, useEffect, useRef } from 'react';
import { Lock, Mail, Phone, Eye, EyeOff, ShieldCheck, KeyRound, AlertCircle, User, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { authService, INITIAL_DEMO_USER } from './data/authService';
import { STORE_INFO } from './data/products';
import banner1 from './assets/login-banner.jpg';
import banner2 from './assets/login-banner2.jpg';
import banner3 from './assets/login-banner3.jpg';
import banner4 from './assets/login-banner4.jpg';
import './LoginPage.css';

const SLIDES = [
  { img: banner1, label: 'Premium Collection' },
  { img: banner2, label: 'Authentic Devices' },
  { img: banner3, label: 'Exclusive Liquids' },
  { img: banner4, label: 'Trusted Store' },
];

export default function LoginPage({ onLoginSuccess, onBackToHome, redirectReason }) {
  const [activeTab, setActiveTab] = useState('login');
  const [slide, setSlide] = useState(0);
  const timerRef = useRef(null);

  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [ageConsent, setAgeConsent] = useState(false);

  // UI
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSlide(s => (s + 1) % SLIDES.length);
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => { setSlide(idx); startTimer(); };
  const prev = () => goTo((slide - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((slide + 1) % SLIDES.length);

  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && showForgotModal && setShowForgotModal(false);
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [showForgotModal]);

  const handleLoginSubmit = (e) => {
    e.preventDefault(); setErrorMsg('');
    if (!loginIdentifier.trim()) { setErrorMsg('Masukkan email atau nomor WhatsApp.'); return; }
    if (!loginPassword) { setErrorMsg('Masukkan kata sandi akun.'); return; }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      try {
        const user = authService.login(loginIdentifier.trim(), loginPassword, rememberMe);
        setSuccessMsg(`Selamat datang, ${user.name}.`);
        setTimeout(() => onLoginSuccess?.(user), 500);
      } catch (err) { setErrorMsg(err.message || 'Email/password salah.'); }
    }, 450);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault(); setErrorMsg('');
    if (!registerName.trim()) { setErrorMsg('Nama lengkap wajib diisi.'); return; }
    if (!registerEmail.includes('@')) { setErrorMsg('Format email tidak valid.'); return; }
    if (!registerPhone.trim()) { setErrorMsg('Nomor WhatsApp wajib diisi.'); return; }
    if (registerPassword.length < 6) { setErrorMsg('Password minimal 6 karakter.'); return; }
    if (registerPassword !== registerConfirmPassword) { setErrorMsg('Konfirmasi password tidak sesuai.'); return; }
    if (!ageConsent) { setErrorMsg('Konfirmasi usia 21+ wajib dicentang.'); return; }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const u = authService.register({ name: registerName.trim(), email: registerEmail.trim(), phone: registerPhone.trim() });
      setSuccessMsg(`Selamat bergabung, ${u.name}!`);
      setTimeout(() => onLoginSuccess?.(u), 600);
    }, 500);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const u = authService.loginDemoUser();
      setSuccessMsg(`Masuk sebagai ${u.name}`);
      setTimeout(() => onLoginSuccess?.(u), 400);
    }, 300);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail.includes('@')) return;
    setForgotSuccess(true);
    setTimeout(() => { setShowForgotModal(false); setForgotSuccess(false); setForgotEmail(''); }, 2200);
  };

  return (
    <div className="lp-root">
      {/* ── LEFT: image panel in phone-frame style ── */}
      <div className="lp-image-panel">
        <div className="lp-phone-frame">
          <div className="lp-phone-top-bar">
            <span className="lp-phone-topbar-label">Selected Works</span>
            <div className="lp-phone-topbar-btns">
              <button className="lp-tbbtn lp-tbbtn-ghost" onClick={onBackToHome}>Sign Up</button>
              <button className="lp-tbbtn lp-tbbtn-solid">Join Us</button>
            </div>
          </div>

          {/* Slides */}
          <div className="lp-slides">
            {SLIDES.map((s, i) => (
              <img
                key={s.img}
                src={s.img}
                alt={s.label}
                className={`lp-slide-img ${i === slide ? 'active' : ''}`}
                draggable={false}
              />
            ))}
            <div className="lp-slide-overlay" />
          </div>

          {/* Bottom user strip */}
          <div className="lp-phone-bottom-bar">
            <div className="lp-bottom-user">
              <div className="lp-user-avatar">RTV</div>
              <div>
                <div className="lp-user-name">Rumah Tua Vape</div>
                <div className="lp-user-role">Authentic Vaping Store</div>
              </div>
            </div>
            <div className="lp-phone-nav-btns">
              <button className="lp-nav-arrow" onClick={prev} aria-label="Prev"><ChevronLeft size={15} /></button>
              <button className="lp-nav-arrow" onClick={next} aria-label="Next"><ChevronRight size={15} /></button>
            </div>
          </div>

          {/* Dots */}
          <div className="lp-slide-dots">
            {SLIDES.map((_, i) => (
              <button key={i} className={`lp-dot ${i === slide ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i+1}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: form panel ── */}
      <div className="lp-form-panel">
        {/* brand top */}
        <div className="lp-form-top">
          <span className="lp-brand-name">RUMAH TUA VAPE</span>
        </div>

        <div className="lp-form-body">
          <h1 className="lp-greeting">
            {activeTab === 'login' ? 'Hi, Vaper!' : 'Bergabung!'}
          </h1>
          <p className="lp-sub">
            {activeTab === 'login' ? 'Selamat datang di Rumah Tua Vape' : 'Buat akun member baru'}
          </p>

          {/* Alerts */}
          {redirectReason === 'checkout' && (
            <div className="lp-alert lp-alert-warn"><AlertCircle size={15} /><span>Login diperlukan untuk checkout.</span></div>
          )}
          {errorMsg && <div className="lp-alert lp-alert-err"><AlertCircle size={15} /><span>{errorMsg}</span></div>}
          {successMsg && <div className="lp-alert lp-alert-ok"><Check size={15} /><span>{successMsg}</span></div>}

          {/* Tabs */}
          <div className="lp-tabs">
            <button className={`lp-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => { setActiveTab('login'); setErrorMsg(''); }}>Masuk</button>
            <button className={`lp-tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => { setActiveTab('register'); setErrorMsg(''); }}>Daftar</button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="lp-form" noValidate>
              <div className="lp-field">
                <input id="lp-id" type="text" placeholder="Email" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} autoComplete="username" required />
              </div>
              <div className="lp-field lp-field-pass">
                <input id="lp-pass" type={showLoginPassword ? 'text' : 'password'} placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} autoComplete="current-password" required />
                <button type="button" className="lp-eye" onClick={() => setShowLoginPassword(!showLoginPassword)} aria-label="toggle">
                  {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="lp-pass-row">
                <label className="lp-remember">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                  <span>Tetap masuk</span>
                </label>
                <button type="button" className="lp-forgot" onClick={() => setShowForgotModal(true)}>Forgot password ?</button>
              </div>

              {/* Divider */}
              <div className="lp-divider"><span>or</span></div>

              {/* Demo (acting as "Login with Google" placeholder) */}
              <button type="button" className="lp-google-btn" onClick={handleQuickDemo} disabled={isLoading}>
                <span className="lp-g-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                </span>
                Masuk Cepat / Akun Demo
              </button>

              {/* Submit */}
              <button type="submit" className="lp-submit" disabled={isLoading}>
                {isLoading ? <span className="lp-spinner" /> : 'Login'}
              </button>

              <p className="lp-switch">
                Belum punya akun? <button type="button" onClick={() => { setActiveTab('register'); setErrorMsg(''); }}>Sign up</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="lp-form" noValidate>
              <div className="lp-field">
                <input id="lp-rname" type="text" placeholder="Nama Lengkap" value={registerName} onChange={e => setRegisterName(e.target.value)} required />
              </div>
              <div className="lp-field">
                <input id="lp-remail" type="email" placeholder="Email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required />
              </div>
              <div className="lp-field">
                <input id="lp-rphone" type="tel" placeholder="Nomor WhatsApp" value={registerPhone} onChange={e => setRegisterPhone(e.target.value)} required />
              </div>
              <div className="lp-field lp-field-pass">
                <input id="lp-rpass" type={showRegisterPassword ? 'text' : 'password'} placeholder="Password (min 6 karakter)" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
                <button type="button" className="lp-eye" onClick={() => setShowRegisterPassword(!showRegisterPassword)} aria-label="toggle">{showRegisterPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
              <div className="lp-field">
                <input id="lp-rconfirm" type={showRegisterPassword ? 'text' : 'password'} placeholder="Ulangi Password" value={registerConfirmPassword} onChange={e => setRegisterConfirmPassword(e.target.value)} required />
              </div>
              <label className="lp-remember">
                <input type="checkbox" checked={ageConsent} onChange={e => setAgeConsent(e.target.checked)} required />
                <span>Saya berusia <strong>21+</strong> dan menyetujui syarat layanan</span>
              </label>
              <button type="submit" className="lp-submit" disabled={isLoading}>
                {isLoading ? <span className="lp-spinner" /> : 'Daftar Akun'}
              </button>
              <p className="lp-switch">Sudah punya akun? <button type="button" onClick={() => { setActiveTab('login'); setErrorMsg(''); }}>Sign in</button></p>
            </form>
          )}
        </div>

        {/* Social icons */}
        <div className="lp-social">
          <a href="#" aria-label="Facebook" className="lp-social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="#" aria-label="Twitter" className="lp-social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
          <a href="#" aria-label="LinkedIn" className="lp-social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></a>
          <a href="#" aria-label="Instagram" className="lp-social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="lp-modal-overlay" onClick={() => setShowForgotModal(false)} role="dialog" aria-modal="true">
          <div className="lp-modal" onClick={e => e.stopPropagation()}>
            <div className="lp-modal-icon"><Lock size={20} /></div>
            <h2>Lupa Kata Sandi</h2>
            <p>Masukkan email terdaftar untuk menerima instruksi reset.</p>
            {forgotSuccess ? (
              <div className="lp-alert lp-alert-ok"><Check size={15}/><span>Instruksi dikirim ke <strong>{forgotEmail}</strong>.</span></div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <div className="lp-field" style={{marginTop:'14px'}}><input type="email" placeholder="email@anda.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required /></div>
                <div className="lp-modal-actions">
                  <button type="button" className="lp-modal-cancel" onClick={() => setShowForgotModal(false)}>Batal</button>
                  <button type="submit" className="lp-submit" disabled={!forgotEmail.includes('@')}>Kirim</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
