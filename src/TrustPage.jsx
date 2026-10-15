import { useState } from 'react';
import { Heart, MapPin, ShieldCheck, Truck } from 'lucide-react';
import './TrustPage.css';

const TESTIMONIALS = [
  ['Andi, Jakarta', 'Barang authentic, packing rapi, respon admin cepat.'],
  ['Rina, Bandung', 'Liquid sampai aman dan rasanya sesuai deskripsi.'],
  ['Dimas, Surabaya', 'Sudah repeat order. Koleksi pod lengkap dan pengiriman cepat.'],
];

export default function TrustPage({ type, wishlist, products, onToggleWishlist, onLogin }) {
  const [email, setEmail] = useState('');
  const title = type === 'account' ? 'Akun Rumah Tua' : type === 'wishlist' ? 'Wishlist Saya' : type === 'about' ? 'Tentang Rumah Tua' : 'Kebijakan & Bantuan';
  const wishlisted = products.filter((product) => wishlist.includes(product.id));

  return <main className="trust-page"><div className="trust-inner">
    <span className="section-tag">RUMAH TUA LOUNGE</span><h1>{title}</h1>
    {type === 'account' && <section className="trust-card account-card"><h2>Masuk ke akun</h2><p>Simpan wishlist dan pantau pesanan dari satu tempat.</p><input type="email" placeholder="Email kamu" value={email} onChange={(event) => setEmail(event.target.value)} /><button className="btn-primary" disabled={!email.includes('@')} onClick={() => { localStorage.setItem('rtv_account_email', email); onLogin?.(email); }}>Masuk / Daftar</button><small>Prototype: login lokal tersimpan di browser.</small></section>}
    {type === 'wishlist' && <section className="trust-grid">{wishlisted.length ? wishlisted.map((product) => <article className="trust-product" key={product.id}><img src={product.image} alt={product.name} /><div><h2>{product.name}</h2><p>{product.brand}</p><button className="wishlist-button active" onClick={() => onToggleWishlist(product.id)}><Heart size={16} fill="currentColor" /> Hapus wishlist</button></div></article>) : <div className="trust-card"><Heart size={34} /><h2>Wishlist masih kosong</h2><p>Klik ikon hati pada produk untuk menyimpannya.</p><a className="btn-primary" href="#featured-products">Jelajahi katalog</a></div>}</section>}
    {type === 'about' && <><section className="trust-card about-copy"><h2>Lebih dari toko vape</h2><p>Rumah Tua Vape adalah lounge untuk vapers yang mencari produk authentic, edukasi bertanggung jawab, dan ruang ngobrol yang hangat.</p><div className="trust-points"><span><ShieldCheck /> Produk authentic</span><span><Truck /> Pengiriman aman</span><span><MapPin /> Datang ke lounge</span></div></section><section className="trust-card"><h2>Testimoni pelanggan</h2><div className="testimonials">{TESTIMONIALS.map(([name, quote]) => <blockquote key={name}><p>“{quote}”</p><cite>{name}</cite></blockquote>)}</div></section><section className="trust-card"><h2>Lokasi toko</h2><p>Hubungi kami untuk alamat dan petunjuk lokasi lounge.</p></section></>}
    {type === 'policy' && <section className="trust-card policy-copy"><h2>Kebijakan Rumah Tua</h2><h3>Keaslian dan umur</h3><p>Produk hanya untuk pelanggan berusia 21 tahun ke atas. Kami menjaga keaslian produk dan meminta pelanggan memakai produk secara bertanggung jawab.</p><h3>Retur dan garansi</h3><p>Hubungi admin maksimal 2×24 jam setelah paket diterima dengan bukti pembelian dan video unboxing.</p><h3>Privasi</h3><p>Data checkout dipakai untuk memproses pesanan dan layanan pelanggan, bukan untuk dijual.</p></section>}
  </div></main>;
}
