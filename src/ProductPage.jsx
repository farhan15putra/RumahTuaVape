import { useState } from 'react';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Minus, Plus, Star } from 'lucide-react';
import './ProductPage.css';

export default function ProductPage({ product, formatRupiah, whatsapp, onAddToCart, onBuyNow }) {
  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const maxStock = typeof product.stock === 'number' ? product.stock : Infinity;
  const inStock = product.inStock !== false && (product.stock === undefined || product.stock > 0);
  const hasPrice = typeof product.price === 'number' && product.price > 0;
  const hasDiscount = hasPrice && product.originalPrice && product.originalPrice > product.price;
  const rating = product.rating || 4.8;
  const reviews = product.reviewsCount || 0;
  const optionGroups = [
    product.nicotineOptions?.length && { label: 'Kadar nikotin', key: 'nicotine', values: product.nicotineOptions },
    product.sizeOptions?.length && { label: 'Ukuran', key: 'size', values: product.sizeOptions },
    product.flavorOptions?.length && { label: 'Rasa', key: 'flavor', values: product.flavorOptions },
    product.colorOptions?.length && { label: 'Warna', key: 'color', values: product.colorOptions },
    product.resistanceOptions?.length && { label: 'Resistansi', key: 'resistance', values: product.resistanceOptions },
  ].filter(Boolean);
  const contactNumber = whatsapp || '6281234567890';
  const whatsappUrl = `https://wa.me/${contactNumber}?text=${encodeURIComponent(`Halo Rumah Tua Vape, saya ingin tanya produk: ${product.name}`)}`;

  return (
    <main className="pdp">
      <div className="pdp-inner">
        <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
          <a href="#">Beranda</a><span>/</span><a href="#featured-products">Katalog</a><span>/</span><span>{product.name}</span>
        </nav>
        <div className="pdp-main">
          <div className="pdp-media">
            {hasDiscount && <span className="pdp-discount-tag">-{product.discountPercent}%</span>}
            <div className="pdp-gallery-main"><img src={product.image} alt={product.name} /></div>
            {product.gallery?.length > 0 && <div className="pdp-gallery-thumbs">{[product.image, ...product.gallery].map((image) => <img key={image} src={image} alt="" />)}</div>}
          </div>
          <div className="pdp-info">
            <span className="pdp-brand">{product.brand}</span>
            <h1 className="pdp-title">{product.name}</h1>
            {product.sku && <p className="pdp-sku">SKU {product.sku}</p>}
            <div className="pdp-rating" aria-label={`Rating ${rating} dari 5`}>
              <span className="pdp-stars" aria-hidden="true">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={17} fill={star <= Math.round(rating) ? 'currentColor' : 'none'} />)}</span>
              <strong>{rating}</strong><span>({reviews} review)</span>
            </div>
            <div className="pdp-price-row"><span className="pdp-price">{hasPrice ? formatRupiah(product.price) : 'Hubungi kami'}</span>{hasDiscount && <span className="pdp-price-original">{formatRupiah(product.originalPrice)}</span>}</div>
            {optionGroups.length > 0 && <div className="pdp-options">{optionGroups.map((group) => <fieldset className="pdp-option-group" key={group.key}><legend>{group.label}</legend><div className="pdp-option-list">{group.values.map((value) => <button type="button" className={selectedOptions[group.key] === value ? 'selected' : ''} key={value} onClick={() => setSelectedOptions((current) => ({ ...current, [group.key]: value }))}>{value}</button>)}</div></fieldset>)}</div>}
            <span className={`pdp-stock ${inStock ? 'in' : 'out'}`}>{inStock ? (typeof product.stock === 'number' ? `Tersedia (${product.stock} stok)` : 'Tersedia') : 'Stok habis'}</span>
            <div className="pdp-actions">
              {hasPrice ? <><div className="pdp-qty"><button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={!inStock || qty <= 1} aria-label="Kurangi"><Minus size={16} /></button><span>{qty}</span><button onClick={() => setQty((q) => Math.min(maxStock, q + 1))} disabled={!inStock || qty >= maxStock} aria-label="Tambah"><Plus size={16} /></button></div><button className="pdp-buy" disabled={!inStock} onClick={() => onAddToCart({ ...product, selectedOptions }, qty)}><ShoppingBag size={18} /> Tambah ke Keranjang</button><button className="pdp-buy pdp-buy-now" disabled={!inStock} onClick={() => onBuyNow({ ...product, selectedOptions }, qty)}><ShoppingBag size={18} /> Beli Sekarang</button></> : <a href={whatsappUrl} target="_blank" rel="noreferrer" className="pdp-buy" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Tanya via WhatsApp</a>}
            </div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="pdp-ask-whatsapp">Tanya produk ini via WhatsApp</a>
            <ul className="pdp-perks"><li><ShieldCheck size={18} /> 100% Authentic</li><li><Truck size={18} /> Pengiriman cepat</li></ul>
            <a href="#featured-products" className="pdp-back"><ArrowLeft size={16} /> Kembali ke katalog</a>
          </div>
        </div>
        {product.description && <section className="pdp-desc-section"><h2>Deskripsi Produk</h2><p>{product.description}</p></section>}
        {product.features?.length > 0 && <section className="pdp-spec-section"><h2>Spesifikasi Produk</h2><ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>}
        <section className="pdp-review-section" aria-labelledby="reviews-title">
          <div className="pdp-review-heading"><div><span className="pdp-section-kicker">CUSTOMER FEEDBACK</span><h2 id="reviews-title">Review Produk</h2></div><div className="pdp-review-score"><strong>{rating}</strong><span className="pdp-stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="currentColor" />)}</span><span>{reviews} review</span></div></div>
          <div className="pdp-review-empty"><Star size={26} /><div><strong>Belum ada review tertulis.</strong><p>Jadilah pembeli pertama yang memberikan review untuk produk ini.</p></div></div>
        </section>
      </div>
    </main>
  );
}
