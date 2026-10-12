import { SCRAPED_PRODUCTS } from './scrapedAdapter';

const BASE_PRODUCTS = [
  {
    id: 1,
    name: "VELOX Pod Pro Kit 40W Carbon Edition",
    brand: "VELOX TECH",
    category: "pod",
    price: 345000,
    originalPrice: 420000,
    rating: 4.9,
    reviewsCount: 142,
    image: "/images/product_pod_black.jpg",
    badge: "BEST SELLER",
    isSale: true,
    discountPercent: 18,
    stock: 24,
    description: "Pod system bertenaga 40W dengan airflow adjustable presisi, baterai 1500mAh, dan coil mesh anti-leaking generasi terbaru.",
    features: ["1500mAh Battery", "OLED Display 0.69\"", "Type-C Fast Charging", "0.4Ω & 0.8Ω Mesh Coil included"],
    inStock: true
  },
  {
    id: 2,
    name: "Tropical Bliss Premium E-Liquid Series 60ml",
    brand: "BLISS LABS",
    category: "liquid",
    price: 135000,
    originalPrice: 155000,
    rating: 4.8,
    reviewsCount: 289,
    image: "/images/product_eliquid.jpg",
    badge: "NEW DROP",
    isSale: true,
    discountPercent: 13,
    stock: 58,
    description: "Perpaduan rasa buah tropis segar: Mango Passion, Pineapple Punch, Guava Lime, Dragonfruit Twist dengan sensasi dingin pas di tenggorokan.",
    nicotineOptions: ["3mg", "6mg"],
    ratio: "70 VG / 30 PG",
    inStock: true
  },
  {
    id: 3,
    name: "Vaporesso GEN 200 Mod Ultra Lightweight",
    brand: "VAPORESSO",
    category: "mod",
    price: 520000,
    originalPrice: 650000,
    rating: 5.0,
    reviewsCount: 96,
    image: "/images/product_mod.jpg",
    badge: "PRO CHOICE",
    isSale: true,
    discountPercent: 20,
    stock: 12,
    description: "Dual 18650 mod teringan di kelasnya dengan AXON chip mutakhir, output hingga 220W, dan display TFT 0.96 inch penuh warna.",
    features: ["Dual 18650 Battery", "Max 220W Output", "Ultra Lightweight Body", "AXON Chipset Pulse Mode"],
    inStock: true
  },
  {
    id: 4,
    name: "SMOK V12-Q4 Replacement Coil Pack (5pcs)",
    brand: "SMOK",
    category: "coil",
    price: 180000,
    originalPrice: 210000,
    rating: 4.7,
    reviewsCount: 78,
    image: "/images/product_coil.jpg",
    badge: "ESSENTIAL",
    isSale: true,
    discountPercent: 14,
    stock: 45,
    description: "Quadruple coils original 0.15Ω membawa vapor tebal dan rasa yang kaya. Rentang rekomendasi 60W - 80W.",
    resistance: "0.15 Ohm (50-100W)",
    inStock: true
  },
  {
    id: 5,
    name: "Vuse GO Gradient Slim Pod Pod Kit",
    brand: "VUSE",
    category: "pod",
    price: 165000,
    originalPrice: 195000,
    rating: 4.8,
    reviewsCount: 204,
    image: "/images/product_pod_colorful.jpg",
    badge: "TRENDING",
    isSale: true,
    discountPercent: 15,
    stock: 31,
    description: "Desain ramping dengan gradasi warna futuristik, draw-activated ergonomis, sangat praktis untuk daily stealth vaping.",
    features: ["800 Puffs Ready", "Ultra Compact Pocket Size", "Smooth Draw Activation", "Leak-resistant Design"],
    inStock: true
  },
  {
    id: 6,
    name: "RTV Signature Liquid Saltnic - Mint Grape 30ml",
    brand: "RUMAH TUA VAPE",
    category: "saltnic",
    price: 110000,
    originalPrice: 125000,
    rating: 4.9,
    reviewsCount: 315,
    image: "/images/product_eliquid.jpg",
    badge: "RTV EXCLUSIVE",
    isSale: true,
    discountPercent: 12,
    stock: 80,
    description: "Kolaborasi spesial Rumah Tua Vape dengan blend anggur merah manis dan ice mint yang dingin menyegarkan.",
    nicotineOptions: ["25mg", "30mg"],
    ratio: "50 VG / 50 PG",
    inStock: true
  },
  {
    id: 7,
    name: "Lost Vape Thelema Quest 200W Starter Kit",
    brand: "LOST VAPE",
    category: "mod",
    price: 685000,
    originalPrice: 790000,
    rating: 4.9,
    reviewsCount: 63,
    image: "/images/product_mod.jpg",
    badge: "HIGH END",
    isSale: true,
    discountPercent: 13,
    stock: 9,
    description: "Performa kelas flagship Quest 2.0 Chipset dengan cover baterai transparan transparan yang ikonik.",
    features: ["Quest 2.0 Chip", "Type-C Fast Charging", "5 Vaping Modes", "Replaceable Battery Door"],
    inStock: true
  },
  {
    id: 8,
    name: "Oxva Xlim Pro V2 Pod Kit 30W",
    brand: "OXVA",
    category: "pod",
    price: 315000,
    originalPrice: 350000,
    rating: 5.0,
    reviewsCount: 412,
    image: "/images/product_pod_black.jpg",
    badge: "TOP PICK",
    isSale: true,
    discountPercent: 10,
    stock: 18,
    description: "Penerus seri Xlim dengan baterai ditingkatkan menjadi 1000mAh dan lampu RGB dynamic bar yang memukau.",
    features: ["1000mAh Battery", "Top Fill Cartridge V3", "RGB Light Dynamic Effect", "Up to 30W"],
    inStock: true
  },
  {
    id: 9,
    name: "FOOM Ice Watermelon Blast Saltnic 30ml",
    brand: "FOOM",
    category: "saltnic",
    price: 105000,
    originalPrice: 130000,
    rating: 4.9,
    reviewsCount: 187,
    image: "/images/product_eliquid.jpg",
    badge: "BEST VALUE",
    isSale: true,
    discountPercent: 19,
    stock: 50,
    description: "Sensasi semangka segar dipadukan dengan cooling menthol ekstra yang menyegarkan di setiap tarikan.",
    nicotineOptions: ["30mg"],
    ratio: "50 VG / 50 PG",
    inStock: true
  },
  {
    id: 10,
    name: "Cotton Bacon Prime Wick & Coil DIY Tool Kit",
    brand: "WICK 'N' VAPE",
    category: "accessories",
    price: 85000,
    originalPrice: 110000,
    rating: 4.8,
    reviewsCount: 92,
    image: "/images/product_coil.jpg",
    badge: "ESSENTIAL",
    isSale: true,
    discountPercent: 23,
    stock: 40,
    description: "Kapas organik 100% medical grade untuk penyerapan e-liquid lebih cepat dan cita rasa murni tanpa bau gosong.",
    features: ["100% Organic Cotton", "Fast Absorption", "Heat Resistant", "No Break-in Period"],
    inStock: true
  }
];

export const PRODUCTS = SCRAPED_PRODUCTS;

const CATEGORY_META = [
  { id: "all", name: "Semua Produk", icon: "Sparkles" },
  { id: "pod", name: "Pod System", icon: "Smartphone" },
  { id: "mod", name: "Vape Mod", icon: "Cpu" },
  { id: "liquid", name: "Freebase Liquid", icon: "Droplets" },
  { id: "saltnic", name: "Saltnic", icon: "Flame" },
  { id: "coil", name: "Coil & Cartridge", icon: "Layers" },
  { id: "accessories", name: "Aksesoris", icon: "Wrench" }
];

export const CATEGORIES = CATEGORY_META.map((category) => ({
  ...category,
  count: category.id === "all"
    ? PRODUCTS.length
    : PRODUCTS.filter((product) => product.category === category.id).length
})).filter((category) => category.id === "all" || category.count > 0);

export const BRANDS = [
  "Semua Brand",
  ...Array.from(new Set(PRODUCTS.map((product) => product.brand))).sort()
];

export const PROMO_DEALS = [
  {
    id: "liquid-deals",
    tag: "PROMO SPESIAL",
    title: "Liquid Deals",
    description: "Hemat hingga 35% untuk koleksi liquid freebase & saltnic pilihan rasa terbaik!",
    discountBadge: "Disc Up To 35%",
    productCount: "4 PRODUK",
    categoryTarget: "liquid",
    image: "/images/product_eliquid.jpg",
    theme: "red"
  },
  {
    id: "pod-deals",
    tag: "DEVICE TERPOPULER",
    title: "Pod & Device Deals",
    description: "Upgrade setup vaping harianmu. Desain ringkas, power maksimal & 100% authentic!",
    discountBadge: "Disc Up To 25%",
    productCount: "5 PRODUK",
    categoryTarget: "pod",
    image: "/images/product_pod_colorful.jpg",
    theme: "blue"
  }
];

export const STORE_FEATURES = [
  {
    icon: "ShieldCheck",
    title: "100% Authentic Guaranteed",
    desc: "Produk asli langsung dari distributor resmi bersertifikasi"
  },
  {
    icon: "Truck",
    title: "Same Day & Express Delivery",
    desc: "Kirim instan se-Jabodetabek & seluruh Indonesia dengan aman"
  },
  {
    icon: "RefreshCw",
    title: "Garansi Retur 7 Hari",
    desc: "Kendala device pabrikan siap kami ganti unit baru"
  },
  {
    icon: "Headphones",
    title: "Konsultasi Vaper Ramah",
    desc: "Tanya setup, ohm coil, atau racikan rasa via WhatsApp kami"
  }
];

export const STORE_INFO = {
  name: "Rumah Tua Vape (RTV)",
  tagline: "Your Authentic Vaping Destination",
  address: "Jl. Tebet Raya No. 42, Jakarta Selatan, DKI Jakarta 12810",
  whatsapp: "+62 812-3456-7890",
  instagram: "@rumahtuavape",
  openingHours: {
    weekdays: "10:00 - 23:00 WIB",
    weekend: "10:00 - 00:00 WIB"
  }
};
