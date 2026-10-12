"""
Scraper nama item + gambar item dari halaman katalog (HTML server-rendered).

Usage:
    python scrape_items.py https://vapehan.com/ --out items.json --download-images

Output:
    items.json  -> [{"name": ..., "image_url": ..., "image_file": ...}, ...]
    images/     -> gambar hasil download (jika --download-images)

Catatan:
    - Hanya ambil <img alt> dan src; nama diambil dari alt, kalau kosong dari teks <a>/<h*> terdekat.
    - Respect robots.txt & rate limit: jeda --delay detik antar request gambar.
    - ponytail: tidak handle pagination / lazy-load (data-src). Upgrade: Playwright bila situs render via JS.
"""
import argparse
import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; RTVScraper/1.0)"}
IMG_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif")


def allowed_by_robots(url: str) -> bool:
    parts = urlparse(url)
    robots_url = f"{parts.scheme}://{parts.netloc}/robots.txt"
    rp = RobotFileParser()
    try:
        # RobotFileParser.read() memperlakukan 401/403 sebagai disallow-all,
        # jadi ambil sendiri dengan UA yang sama lalu parse isinya.
        r = requests.get(robots_url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            rp.parse(r.text.splitlines())
        else:
            return True  # tidak ada robots.txt -> tidak ada larangan eksplisit
    except requests.RequestException:
        return True
    return rp.can_fetch(HEADERS["User-Agent"], url)


def extract_name(img, soup_img_tag) -> str:
    alt = (img.get("alt") or "").strip()
    if alt:
        return alt
    # fallback: teks link/heading terdekat
    parent = img.find_parent("a") or img.find_parent()
    if parent:
        text = " ".join(parent.get_text(" ", strip=True).split())
        if text:
            return text[:150]
    return ""


def is_product_image(src: str) -> bool:
    # ambil hanya gambar produk dari CDN katalog (by-sku), bukan logo/ikon/banner
    return "by-sku" in src or src.lower().split("?")[0].endswith(IMG_EXT)


def scrape(url: str) -> list[dict]:
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    items, seen = [], set()
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        if not src or src.startswith("data:"):
            continue
        full = urljoin(url, src)
        if full in seen or not is_product_image(full):
            continue
        seen.add(full)
        name = extract_name(img, img)
        if not name:
            continue
        items.append({"name": name, "image_url": full})
    return items


def download_images(items: list[dict], out_dir: Path, delay: float) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    for i, item in enumerate(items, 1):
        try:
            r = requests.get(item["image_url"], headers=HEADERS, timeout=20)
            r.raise_for_status()
            ctype = r.headers.get("Content-Type", "")
            ext = ".webp" if "webp" in ctype else ".png" if "png" in ctype else ".jpg"
            slug = re.sub(r"[^a-z0-9]+", "_", item["name"].lower()).strip("_")[:60] or f"item_{i}"
            path = out_dir / f"{i:03d}_{slug}{ext}"
            path.write_bytes(r.content)
            item["image_file"] = str(path)
            print(f"[{i}/{len(items)}] OK  {path.name}")
        except Exception as e:
            item["image_file"] = None
            print(f"[{i}/{len(items)}] GAGAL {item['image_url']}: {e}")
        time.sleep(delay)


def main() -> None:
    ap = argparse.ArgumentParser(description="Scrape nama & gambar item dari halaman katalog.")
    ap.add_argument("url")
    ap.add_argument("--out", default="items.json")
    ap.add_argument("--download-images", action="store_true")
    ap.add_argument("--img-dir", default="images")
    ap.add_argument("--delay", type=float, default=0.5)
    ap.add_argument("--force", action="store_true", help="abaikan robots.txt")
    args = ap.parse_args()

    if not args.force and not allowed_by_robots(args.url):
        raise SystemExit("Diblokir robots.txt. Pakai --force bila memang diizinkan pemilik situs.")

    items = scrape(args.url)
    print(f"Ditemukan {len(items)} item.")

    if args.download_images:
        download_images(items, Path(args.img_dir), args.delay)

    Path(args.out).write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Tersimpan ke {args.out}")


if __name__ == "__main__":
    main()
