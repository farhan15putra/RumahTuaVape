"""
Ambil detail tiap produk (harga asli, stok, brand, SKU, deskripsi) dari halaman /product/<slug>.

Input : scraper/products.json  (hasil scrape_playwright.py)
Output: scraper/product_details.json

Usage:
    python scraper/scrape_details.py
"""
import json
import re
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

SRC = Path("scraper/products.json")
OUT = Path("scraper/product_details.json")
UA = "Mozilla/5.0 (compatible; RTVScraper/1.0)"


def parse_rp(text: str) -> list[int]:
    return [int(m.replace(".", "")) for m in re.findall(r"Rp\s?([\d.]+)", text)]


def parse_page(body: str, h1: str) -> dict:
    head, _, rest = body.partition("Product Details")
    desc, _, _ = rest.partition("You May Also Like")
    prices = parse_rp(head)
    brand = re.search(r"Brands\s*:\s*(.+)", head)
    sku = re.search(r"SKU\s*:\s*(\S+)", head)
    return {
        "name": h1,
        "brand": brand.group(1).strip() if brand else None,
        "sku": sku.group(1) if sku else None,
        "price": prices[0] if prices else None,
        "original_price": prices[1] if len(prices) > 1 else None,
        "in_stock": "out of stock" not in head.lower() and "sold out" not in head.lower(),
        "description": desc.strip(),
    }


def main() -> None:
    products = json.loads(SRC.read_text(encoding="utf-8"))
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(user_agent=UA)
        for i, item in enumerate(products, 1):
            try:
                page.goto(item["product_url"], wait_until="domcontentloaded", timeout=60000)
                page.wait_for_selector("h1", timeout=20000)
                page.wait_for_timeout(1500)
                h1 = page.inner_text("h1").strip()
                body = page.evaluate("() => document.querySelector('main')?.innerText || document.body.innerText")
                detail = parse_page(body, h1)
                detail.update({
                    "product_url": item["product_url"],
                    "image_file": item.get("image_file"),
                })
                results.append(detail)
                print(f"[{i}/{len(products)}] OK  {h1[:50]} | Rp {detail['price']} | stock={detail['in_stock']}")
            except Exception as e:
                print(f"[{i}/{len(products)}] GAGAL {item['product_url']}: {e}")
                results.append({**item, "error": str(e)})
            time.sleep(0.3)
        browser.close()
    OUT.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Tersimpan {len(results)} item ke {OUT}")


if __name__ == "__main__":
    main()
