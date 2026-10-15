import scraped from './scraped_products.json';
import details from './product_details.json';

// Gabungkan hasil scrape nama+gambar dengan detail halaman produk (harga asli, stok, brand, SKU).
const byUrl = Object.fromEntries(details.map((d) => [d.product_url, d]));

// Karakter  di sumber (en dash yang rusak encoding) diganti tanda hubung.
const cleanText = (s) => (s || '').replace(/\uFFFD/g, '-').replace(/\s+/g, ' ').trim();

const guessCategory = (name, explicitCategory) => {
  if (explicitCategory) return explicitCategory;
  const n = name.toLowerCase();
  if (/\b(?:salt|saltnic|salts)\b/.test(n)) return 'saltnic';
  if (/\b(?:mod|mods|boxmod)\b/.test(n)) return 'mod';
  if (/\b(?:pod|pods|aio|starter kit|bundle kit)\b/.test(n) || (/\bkit\b/.test(n) && !/\btool\b/.test(n))) return 'pod';
  if (/\b(?:coil|coils|wick|cartridge|catridge|occ)\b/.test(n)) return 'coil';
  if (/\b(?:cotton|kapas|baterai|battery|charger|case|lanyard|tool|tweezer)\b/.test(n)) return 'accessories';
  if (/\b(?:liquid|eliquid|e-liquid|freebase)\b/.test(n) || /\b\d+\s*ml\b/.test(n)) return 'liquid';
  return 'liquid';
};

export const SCRAPED_PRODUCTS = scraped.map((item, i) => {
  const d = byUrl[item.product_url] || {};
  const name = cleanText(d.name || item.name);
  const rawPrice = d.price;
  const price = typeof rawPrice === 'number' && rawPrice > 0 ? rawPrice : null;
  const originalPrice = d.original_price && price && d.original_price > price ? d.original_price : null;
  const discountPercent = (originalPrice && price) ? Math.round((1 - price / originalPrice) * 100) : 0;
  const inStock = d.in_stock !== false;
  const stock = typeof d.stock === 'number' ? d.stock : (inStock ? 25 : 0);

  return {
    id: 100 + i,
    slug: item.product_url.split('/').pop(),
    name,
    brand: d.brand || 'RTV',
    sku: d.sku || null,
    category: guessCategory(name, d.category || item.category),
    price,
    originalPrice,
    discountPercent,
    description: cleanText(d.description),
    image: `/images/products/${item.image_file.split(/[\\/]/).pop()}`,
    productUrl: item.product_url,
    inStock: inStock && stock > 0,
    stock,
    isSale: discountPercent > 0,
    badge: null,
    rating: 0,
    reviewsCount: 0,
  };
});

