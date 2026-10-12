import { useState } from 'react';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Minus, Plus, Star } from 'lucide-react';
import './ProductPage.css';

export default function ProductPage({ product, formatRupiah, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const inStock = product.inStock !== false;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const rating = product.rating || 4.8;
  const reviews = product.reviewsCount || 0;

  return (
    <main className="pdp">
      <div className="pdp-inner">
        <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
          <a href="#">Beranda</a><span>/</span><a href="#featured-products">Katalog</a><span>/</span><span>{product.name}</span>
        </nav>
        <div className="pdp-main">
          <div className="pdp-media">
            {hasDiscount && <span className="pdp-discount-tag">-{product.discountPercent}%</span>}
            <img src={product.image} alt={product.name} />
          </div>
          <div className="pdp-info">
            <span className="pdp-brand">{product.brand}</span>
            <h1 className="pdp-title">{product.name}</h1>
            {product.sku && <p className="pdp-sku">SKU {product.sku}</p>}
            <div className="pdp-rating" aria-label={`Rating ${rating} dari 5`}>
              <span className="pdp-stars" aria-hidden="true">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={17} fill={star <= Math.round(rating) ? 'currentColor' : 'none'} />)}</span>
              <strong>{rating}</strong><span>({reviews} review)</span>
            </div>
            <div className="pdp-price-row"><span className="pdp-price">{formatRupiah(product.price)}</span>{hasDiscount && <span className="pdp-price-original">{formatRupiah(product.originalPrice)}</span>}</div>
            <span className={`pdp-stock ${inStock ? 'in' : 'out'}`}>{inStock ? 'Tersedia' : 'Stok habis'}</span>
            <div className="pdp-actions">
              <div className="pdp-qty"><button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={!inStock} aria-label="Kurangi"><Minus size={16} /></button><span>{qty}</span><button onClick={() => setQty((q) => q + 1)} disabled={!inStock} aria-label="Tambah"><Plus size={16} /></button></div>
              <button className="pdp-buy" disabled={!inStock} onClick={() => onAddToCart(product, qty)}><ShoppingBag size={18} /> Tambah ke Keranjang</button>
            </div>
            <ul className="pdp-perks"><li><ShieldCheck size={18} /> 100% Authentic</li><li><Truck size={18} /> Pengiriman cepat</li></ul>
            <a href="#featured-products" className="pdp-back"><ArrowLeft size={16} /> Kembali ke katalog</a>
          </div>
        </div>
        {product.description && <section className="pdp-desc-section"><h2>Deskripsi Produk</h2><p>{product.description}</p></section>}
        <section className="pdp-review-section" aria-labelledby="reviews-title">
          <div className="pdp-review-heading"><div><span className="pdp-section-kicker">CUSTOMER FEEDBACK</span><h2 id="reviews-title">Review Produk</h2></div><div className="pdp-review-score"><strong>{rating}</strong><span className="pdp-stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="currentColor" />)}</span><span>{reviews} review</span></div></div>
          <div className="pdp-review-empty"><Star size={26} /><div><strong>Belum ada review tertulis.</strong><p>Jadilah pembeli pertama yang memberikan review untuk produk ini.</p></div></div>
        </section>
      </div>
    </main>
  );
}
