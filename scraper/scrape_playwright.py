"""
Scraper nama + gambar produk vapehan.com memakai Playwright (halaman dirender JS).

Usage:
    python scraper/scrape_playwright.py --out scraper/products.json --download-images

Struktur yang dipakai (hasil inspeksi DOM):
    <a href="/product/<slug>"><img alt="<NAMA PRODUK>" src="/_next/image?url=<encoded CDN url>"></a>
Banner promo (<a href="/shop">) dibuang karena tidak punya link /product/.
"""
import argparse
import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse, parse_qs

import requests
from playwright.sync_api import sync_playwright

BASE = "https://vapehan.com/"
UA = "Mozilla/5.0 (compatible; RTVScraper/1.0)"


def real_image_url(src: str) -> str:
    """Unwrap /_next/image?url=... jadi URL CDN asli."""
    full = urljoin(BASE, src)
    qs = parse_qs(urlparse(full).query)
    return qs["url"][0] if "url" in qs else full


def scrape(page_url: str) -> list[dict]:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(user_agent=UA)
        page.goto(page_url, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_selector("a[href^='/product/'] img", timeout=30000)
        # scroll untuk memicu lazy-load gambar kartu
        for _ in range(12):
            page.mouse.wheel(0, 1200)
            page.wait_for_timeout(400)

        raw = page.eval_on_selector_all(
            "a[href^='/product/']",
            """els => els.map(a => {
                const img = a.querySelector('img');
                return {
                    href: a.getAttribute('href'),
                    name: img ? img.alt : '',
                    src: img ? (img.currentSrc || img.src) : ''
                };
            })""",
        )
        browser.close()

    items, seen = [], set()
    for r in raw:
        if not r["name"] or r["href"] in seen:
            continue
        seen.add(r["href"])
        items.append({
            "name": r["name"].strip(),
            "product_url": urljoin(BASE, r["href"]),
            "image_url": real_image_url(r["src"]),
        })
    return items


def download_images(items: list[dict], out_dir: Path, delay: float) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    for i, item in enumerate(items, 1):
        try:
            r = requests.get(item["image_url"], headers={"User-Agent": UA}, timeout=20)
            r.raise_for_status()
            ctype = r.headers.get("Content-Type", "")
            ext = ".webp" if "webp" in ctype else ".png" if "png" in ctype else ".jpg"
            slug = re.sub(r"[^a-z0-9]+", "_", item["name"].lower()).strip("_")[:60]
            path = out_dir / f"{i:03d}_{slug}{ext}"
            path.write_bytes(r.content)
            item["image_file"] = str(path)
            print(f"[{i}/{len(items)}] OK  {path.name}")
        except Exception as e:
            item["image_file"] = None
            print(f"[{i}/{len(items)}] GAGAL {item['image_url']}: {e}")
        time.sleep(delay)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default=BASE)
    ap.add_argument("--out", default="scraper/products.json")
    ap.add_argument("--download-images", action="store_true")
    ap.add_argument("--img-dir", default="scraper/images")
    ap.add_argument("--delay", type=float, default=0.3)
    args = ap.parse_args()

    items = scrape(args.url)
    print(f"Ditemukan {len(items)} produk.")

    if args.download_images:
        download_images(items, Path(args.img_dir), args.delay)

    Path(args.out).write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Tersimpan ke {args.out}")


if __name__ == "__main__":
    main()
