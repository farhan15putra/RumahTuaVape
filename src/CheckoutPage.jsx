import { useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, MapPin, ShoppingBag, Truck, User } from 'lucide-react';
import { authService } from './data/authService';
import './CheckoutPage.css';

export default function CheckoutPage({ cart, totalPrice, formatRupiah, whatsapp, onBack, onComplete, currentUser, onGoToProfile }) {
  const [form, setForm] = useState(() => {
    const user = currentUser || authService.getCurrentUser();
    return {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address ? `${user.address}${user.city ? `, ${user.city}` : ''}` : '',
      courier: 'J&T Express',
      payment: 'Transfer Bank'
    };
  });
  const [receipt, setReceipt] = useState(null);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const shippingCost = form.courier === 'Instant / Sameday' ? 18000 : 12000;
  const grandTotal = totalPrice + shippingCost;

  const generateWhatsAppMessage = (orderData) => {
    const itemList = (orderData.items || [])
      .map((item, idx) => `${idx + 1}. ${item.name} (${item.quantity}x) - ${formatRupiah(item.price * item.quantity)}`)
      .join('\n');

    return `Halo Rumah Tua Vape, saya ingin konfirmasi pesanan:

*Nomor Pesanan:* ${orderData.orderId}
*Tanggal:* ${orderData.createdAt}

*Data Pembeli:*
- Nama: ${orderData.name}
- No. WhatsApp: ${orderData.phone}
- Alamat: ${orderData.address}
- Kurir: ${orderData.courier}
- Metode Pembayaran: ${orderData.payment}

*Rincian Produk:*
${itemList}

*Subtotal:* ${formatRupiah(orderData.subtotal)}
*Ongkos Kirim:* ${formatRupiah(orderData.shippingCost)}
*Total Pembayaran:* ${formatRupiah(orderData.grandTotal)}

Mohon konfirmasi pesanan saya. Terima kasih!`;
  };

  const submit = (event) => {
    event.preventDefault();
    const orderData = {
      ...form,
      items: cart,
      subtotal: totalPrice,
      shippingCost,
      grandTotal,
      orderId: `RTV-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Sedang Dikirim',
      trackingNumber: `JNT-${Date.now().toString().slice(-10)}`
    };
    
    // Save to user order history
    authService.addOrder(orderData);

    setReceipt(orderData);
    onComplete();

    const targetNumber = (whatsapp || '6281234567890').replace(/[^0-9]/g, '');
    const waText = generateWhatsAppMessage(orderData);
    const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(waText)}`;
    try {
      window.open(waUrl, '_blank');
    } catch (err) {
      console.error('Failed to open WhatsApp window:', err);
    }
  };

  if (receipt) {
    const targetNumber = (whatsapp || '6281234567890').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(generateWhatsAppMessage(receipt))}`;

    return (
      <main className="checkout-page">
        <div className="receipt-card">
          <div className="receipt-prototype-banner">
            <span className="prototype-badge">PROTOTIPE</span>
            <p>
              Ini adalah <strong>simulasi checkout pesanan</strong> untuk pengujian sistem. Tidak ada pembayaran riil yang dipotong.
            </p>
          </div>

          <div className="receipt-success">
            <CheckCircle2 size={52} />
            <span>PESANAN DITERIMA</span>
            <h1>Terima kasih, {receipt.name}!</h1>
            <p>Pesanan Anda telah berhasil dibuat. Silakan lanjutkan konfirmasi pesanan ke WhatsApp Rumah Tua Vape.</p>
          </div>

          <div className="receipt-meta">
            <div>
              <span>Nomor Pesanan</span>
              <strong>{receipt.orderId}</strong>
            </div>
            <div>
              <span>Tanggal</span>
              <strong>{receipt.createdAt}</strong>
            </div>
          </div>

          <div className="receipt-address">
            <strong>Alamat Pengiriman</strong>
            <p>{receipt.address}</p>
            <span>{receipt.phone} · {receipt.courier}</span>
          </div>

          <div className="receipt-items">
            {receipt.items.map((item) => (
              <div className="receipt-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.quantity} x {formatRupiah(item.price)}</span>
                </div>
                <b>{formatRupiah(item.price * item.quantity)}</b>
              </div>
            ))}
          </div>

          <div className="receipt-total">
            <div>
              <span>Subtotal</span>
              <b>{formatRupiah(receipt.subtotal)}</b>
            </div>
            <div>
              <span>Ongkir</span>
              <b>{formatRupiah(receipt.shippingCost)}</b>
            </div>
            <div className="receipt-grand-total">
              <span>Total Pesanan</span>
              <strong>{formatRupiah(receipt.grandTotal)}</strong>
            </div>
          </div>

          <div className="receipt-payment">
            <CreditCard size={17} /> Metode Pembayaran: <strong>{receipt.payment}</strong>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="checkout-primary receipt-wa-button"
          >
            Kirim Ringkasan ke WhatsApp Admin
          </a>

          {onGoToProfile && (
            <button 
              className="receipt-back-btn" 
              style={{ background: 'var(--primary-red)', color: '#ffffff', borderColor: 'var(--primary-red)', marginTop: '8px' }}
              onClick={onGoToProfile}
            >
              <User size={15} style={{ verticalAlign: 'middle', marginRight: '6px', display: 'inline' }} />
              Lihat di Profil & Lacak Resi
            </button>
          )}

          <button className="receipt-back-btn" onClick={onBack}>
            Kembali ke Toko
          </button>
          <button className="receipt-print" onClick={() => window.print()}>
            Cetak / Simpan Struk
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-inner">
        <button className="checkout-back" onClick={onBack}>
          <ArrowLeft size={17} /> Kembali ke keranjang
        </button>
        <div className="checkout-heading">
          <span>RTV CHECKOUT</span>
          <h1>Selesaikan Pesanan</h1>
          <p>Isi alamat pengiriman, pilih kurir, lalu konfirmasi pesanan via WhatsApp.</p>
        </div>
        <form className="checkout-layout" onSubmit={submit}>
          <div className="checkout-form-card">
            <section className="checkout-section">
              <div className="checkout-section-title">
                <MapPin size={19} />
                <h2>Alamat Pengiriman</h2>
              </div>
              <div className="checkout-fields">
                <label>
                  Nama penerima
                  <input name="name" value={form.name} onChange={update} required placeholder="Nama lengkap" />
                </label>
                <label>
                  Nomor WhatsApp
                  <input name="phone" value={form.phone} onChange={update} required pattern="[0-9+ ]{9,}" placeholder="08xxxxxxxxxx" />
                </label>
                <label className="checkout-full">
                  Alamat lengkap
                  <textarea name="address" value={form.address} onChange={update} required rows="4" placeholder="Nama jalan, nomor rumah, kecamatan, kota, kode pos" />
                </label>
              </div>
            </section>
            <section className="checkout-section">
              <div className="checkout-section-title">
                <Truck size={19} />
                <h2>Pengiriman</h2>
              </div>
              <div className="checkout-choice-row">
                {['J&T Express', 'Instant / Sameday'].map((courier) => (
                  <label className={`checkout-choice ${form.courier === courier ? 'active' : ''}`} key={courier}>
                    <input type="radio" name="courier" value={courier} checked={form.courier === courier} onChange={update} />
                    <span>{courier}</span>
                    <strong>{formatRupiah(courier === 'Instant / Sameday' ? 18000 : 12000)}</strong>
                  </label>
                ))}
              </div>
            </section>
            <section className="checkout-section">
              <div className="checkout-section-title">
                <CreditCard size={19} />
                <h2>Metode Pembayaran</h2>
              </div>
              <div className="checkout-choice-row">
                {['Transfer Bank', 'COD (Jika tersedia)'].map((payment) => (
                  <label className={`checkout-choice ${form.payment === payment ? 'active' : ''}`} key={payment}>
                    <input type="radio" name="payment" value={payment} checked={form.payment === payment} onChange={update} />
                    <span>{payment}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>
          <aside className="checkout-summary">
            <div className="checkout-summary-title">
              <ShoppingBag size={19} />
              <h2>Ringkasan Pesanan</h2>
            </div>
            <div className="checkout-items">
              {cart.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.quantity} x {formatRupiah(item.price)}</span>
                  </div>
                  <b>{formatRupiah(item.price * item.quantity)}</b>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <div>
                <span>Subtotal</span>
                <b>{formatRupiah(totalPrice)}</b>
              </div>
              <div>
                <span>Ongkir</span>
                <b>{formatRupiah(shippingCost)}</b>
              </div>
              <div className="checkout-grand-total">
                <span>Total</span>
                <strong>{formatRupiah(grandTotal)}</strong>
              </div>
            </div>
            <button className="checkout-primary" type="submit">
              Konfirmasi Pesanan ke WhatsApp
            </button>
            <small>Prototipe: setelah klik, rincian pesanan akan dikirim ke WhatsApp toko.</small>
          </aside>
        </form>
      </div>
    </main>
  );
}

