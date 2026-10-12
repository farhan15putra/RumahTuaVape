import scraped from './scraped_products.json';
import details from './product_details.json';

// Gabungkan hasil scrape nama+gambar dengan detail halaman produk (harga asli, stok, brand, SKU).
const byUrl = Object.fromEntries(details.map((d) => [d.product_url, d]));

// Karakter � di sumber (en dash yang rusak encoding) diganti tanda hubung.
const cleanText = (s) => (s || '').replace(/\uFFFD/g, '-').replace(/\s+/g, ' ').trim();

const guessCategory = (name) => {
  const n = name.toLowerCase();
  if (/salt/.test(n)) return 'saltnic';
  if (/mod/.test(n)) return 'mod';
  if (/pod|kit|starter|bundl/.test(n)) return 'pod';
  if (/coil|wick/.test(n)) return 'coil';
  return 'liquid';
};

export const SCRAPED_PRODUCTS = scraped.map((item, i) => {
  const d = byUrl[item.product_url] || {};
  const name = cleanText(d.name || item.name);
  const price = d.price ?? 0;
  const originalPrice = d.original_price && d.original_price > price ? d.original_price : null;
  const discountPercent = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  return {
    id: 100 + i,
    slug: item.product_url.split('/').pop(),
    name,
    brand: d.brand || 'RTV',
    sku: d.sku || null,
    category: guessCategory(name),
    price,
    originalPrice,
    discountPercent,
    description: cleanText(d.description),
    image: `/images/products/${item.image_file.split(/[\\/]/).pop()}`,
    productUrl: item.product_url,
    inStock: d.in_stock !== false,
    isSale: discountPercent > 0,
    badge: null,
    rating: 0,
    reviewsCount: 0,
  };
});
