#!/usr/bin/env python3
"""
Extract every piece of content from the global.suofeiya.com mirror
and emit a single JSON dataset that the Next.js app can consume.

Walks:
  - suofeiya_mirror/global.suofeiya.com/list/*.html    (66 unique categories)
  - suofeiya_mirror/global.suofeiya.com/detail/*.html  (155 items)

Produces:
  - next-app/src/lib/cms.json
  - next-app/scripts/images_to_fetch.txt  (UUIDs to download)

The "shared" image UUIDs that appear on every page (menu thumbnails,
banner placeholders) are filtered out so the per-item gallery only
contains real product photographs.
"""
from __future__ import annotations
import json
import os
import re
import sys
from collections import defaultdict
from html import unescape
from pathlib import Path
from typing import Optional

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing beautifulsoup4...", file=sys.stderr)
    os.system("pip3 install --quiet beautifulsoup4 lxml")
    from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
MIRROR = ROOT / "suofeiya_mirror" / "global.suofeiya.com"
OUT_JSON = ROOT / "next-app" / "src" / "lib" / "cms.json"
OUT_IMG_LIST = ROOT / "next-app" / "scripts" / "images_to_fetch.txt"

# UUIDs that appear on every page (header logo, breadcrumb pics, menu
# placeholders) — filtered out of per-item galleries so we only keep
# product/project photography.
SHARED_UUIDS = {
    "09f5af04-1260-4d21-8509-7207d821b935",
    "cc061ad3-235b-418a-a9c4-d6f965908657",
    "3b1e8423-5156-4fb9-a0da-f68cf6118f0f",
    "7b7cb8aa-44fc-40a0-9ba6-1778a4188617",
    "33572bba-6730-436a-84ff-9e2a1243b1ec",
    "9608e03b-c04b-418f-b6d9-0fe15adce958",
    "3ac24a1b-4ff7-45ed-b9f8-9f0efd7d23e1",
    "e71db42d-a1fa-422c-8fc1-9c379502ffff",  # generic placeholder used in repeats
}

UUID_RE = re.compile(r"https?://file\.suofeiya\.com\.cn/v/([a-f0-9-]{36})")
WS_RE = re.compile(r"\s+")


def text_of(node) -> str:
    """Whitespace-collapsed plain text."""
    if node is None:
        return ""
    return WS_RE.sub(" ", unescape(node.get_text(" ", strip=True))).strip()


def slugify(s: str) -> str:
    s = re.sub(r"[^A-Za-z0-9\s-]", "", s).strip().lower()
    s = re.sub(r"\s+", "-", s)
    return s or "untitled"


def extract_uuids(html: str) -> list[str]:
    seen = set()
    out = []
    for m in UUID_RE.finditer(html):
        u = m.group(1)
        if u in SHARED_UUIDS or u in seen:
            continue
        seen.add(u)
        out.append(u)
    return out


def parse_metadata(dsc: str) -> dict[str, str]:
    """Convert mirror `<strong>Label:</strong> value<p>...` lines into a dict."""
    meta: dict[str, str] = {}
    # Patterns like "Project:" / "Project Address:" / "Location:"
    for line in re.split(r"<\s*p[^>]*>", dsc):
        m = re.match(r"\s*<strong>\s*([^<:]+?)\s*:\s*</strong>\s*&?nbsp;?(.*?)(?:<|$)", line)
        if m:
            key = WS_RE.sub(" ", m.group(1)).strip().rstrip(":")
            val = WS_RE.sub(" ", re.sub(r"<[^>]+>", "", m.group(2))).strip()
            if key and val and val != "&nbsp;":
                meta[key] = val
        else:
            # Fallback: "Project: ST" without strong tags
            stripped = re.sub(r"<[^>]+>", "", line).strip()
            m = re.match(r"([A-Z][A-Za-z &]+?):\s*(.+)", stripped)
            if m and len(m.group(1)) < 32:
                meta[m.group(1).strip()] = m.group(2).strip()
    return meta


def parse_list_page(path: Path) -> Optional[dict]:
    """A category index page → category record + its item references."""
    html = path.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(html, "lxml")

    title = text_of(soup.find("title"))
    # Trim the trailing "- suofeiya"
    title = re.sub(r"\s*-\s*suofeiya\s*$", "", title, flags=re.I).strip()

    # Category banner / hero image, when present
    hero = None
    banner = soup.find(class_=re.compile(r"banner-bk|list-banner|product-banner"))
    if banner:
        img = banner.find("img")
        if img and img.get("src"):
            m = UUID_RE.search(img["src"])
            if m: hero = m.group(1)

    # Items in the grid — each one links to a /detail/<id>.html
    items = []
    for a in soup.find_all("a", href=True):
        m = re.search(r"detail/(\d+)\.html$", a["href"])
        if not m: continue
        items.append(m.group(1))

    # Dedupe in-order
    seen = set()
    items = [i for i in items if not (i in seen or seen.add(i))]

    page_id = path.stem
    # Ignore secondary paginated/style pages — they all point at the same items
    if "__" in page_id:
        return None

    return {
        "id": page_id,
        "title": title,
        "slug": slugify(title),
        "hero_uuid": hero,
        "item_ids": items
    }


def parse_detail_page(path: Path) -> Optional[dict]:
    """A product / series / project detail page."""
    html = path.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(html, "lxml")

    title = text_of(soup.find("title"))
    title = re.sub(r"\s*-\s*suofeiya\s*$", "", title, flags=re.I).strip()
    # Strip trailing " | SUOFEIYA" branding noise too
    title = re.sub(r"\s*\|\s*SUOFEIYA\s*$", "", title, flags=re.I).strip()

    # Try to find a name + breadcrumb category in the detail header
    name = title
    cat_label = None
    big_name = soup.find(class_=re.compile(r"big-name|big-title|art-title|news-title|detail-title"))
    if big_name:
        nm = text_of(big_name)
        if nm: name = nm

    # The `.dsc` block at the top of the page holds the metadata
    dsc_block = soup.find("div", class_="dsc")
    metadata: dict[str, str] = {}
    summary = ""
    if dsc_block:
        raw = str(dsc_block)
        metadata = parse_metadata(raw)
        summary = text_of(dsc_block)
        # When the dsc was metadata-only, summary will be just the joined values
        # — that's fine.

    # Optional richer body text (.art-content / .news-content / .article-info)
    body_node = soup.find(class_=re.compile(r"art-content|news-content|article-info|details-content"))
    body_text = text_of(body_node) if body_node else ""

    images = extract_uuids(html)

    page_id = path.stem
    return {
        "id": page_id,
        "title": name,
        "slug": slugify(name),
        "metadata": metadata,
        "summary": summary,
        "body": body_text,
        "images": images
    }


def main() -> int:
    list_pages: list[dict] = []
    detail_pages: list[dict] = []

    for f in sorted((MIRROR / "list").glob("*.html")):
        rec = parse_list_page(f)
        if rec is not None:
            list_pages.append(rec)

    for f in sorted((MIRROR / "detail").glob("*.html")):
        rec = parse_detail_page(f)
        if rec is not None:
            detail_pages.append(rec)

    # Reverse map: which categories reference each detail id?
    cat_for_id: dict[str, list[str]] = defaultdict(list)
    for cat in list_pages:
        for iid in cat["item_ids"]:
            cat_for_id[iid].append(cat["id"])

    # Attach primary category to each item
    for item in detail_pages:
        cats = cat_for_id.get(item["id"], [])
        item["category_ids"] = cats
        item["primary_category_id"] = cats[0] if cats else None

    # Build dataset
    dataset = {
        "categories": list_pages,
        "items": detail_pages
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(dataset, indent=2, ensure_ascii=False))

    # Collect every unique UUID we'll need to download
    needed = set()
    for cat in list_pages:
        if cat.get("hero_uuid"): needed.add(cat["hero_uuid"])
    for item in detail_pages:
        needed.update(item.get("images", []))
    OUT_IMG_LIST.parent.mkdir(parents=True, exist_ok=True)
    OUT_IMG_LIST.write_text("\n".join(sorted(needed)))

    print(f"✓ categories  : {len(list_pages)}", file=sys.stderr)
    print(f"✓ items       : {len(detail_pages)}", file=sys.stderr)
    print(f"✓ images      : {len(needed)}", file=sys.stderr)
    print(f"✓ wrote       : {OUT_JSON.relative_to(ROOT)}", file=sys.stderr)
    print(f"✓ wrote       : {OUT_IMG_LIST.relative_to(ROOT)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
