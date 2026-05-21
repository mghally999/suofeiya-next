#!/usr/bin/env bash
# Parallel image fetcher: read UUIDs from images_to_fetch.txt, follow
# the CDN's HTML redirect body to the signed S3 URL, save to
# public/cms/<uuid>.jpg. Skips files that already exist + look real.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/next-app/public/cms"
LIST="$ROOT/next-app/scripts/images_to_fetch.txt"
PARALLEL=12

mkdir -p "$DEST"

fetch_one() {
  local u=$1
  local f="$DEST/$u.jpg"

  # Skip if we already have a real file (>5KB)
  if [ -f "$f" ] && [ "$(stat -f %z "$f" 2>/dev/null || stat -c %s "$f")" -gt 5000 ]; then
    return 0
  fi

  # First request returns an HTML redirect body to the real URL.
  local redirect
  redirect=$(curl -fsS --max-time 20 "https://file.suofeiya.com.cn/v/$u" \
              -H "User-Agent: Mozilla/5.0" \
              -H "Referer: https://global.suofeiya.com/" 2>/dev/null) || {
    echo "  ✗ $u (CDN error)" >&2
    return 1
  }

  local real
  real=$(echo "$redirect" | grep -oE 'href="[^"]+"' | head -1 | sed 's/href="//;s/"$//;s/&amp;/\&/g')
  if [ -z "$real" ]; then
    # Some responses are already the image itself
    if [[ "$redirect" =~ ^.JFIF || "$redirect" =~ ^.PNG ]]; then
      echo "$redirect" > "$f"
      return 0
    fi
    echo "  ✗ $u (no href)" >&2
    return 1
  fi

  if curl -fsS --max-time 30 -o "$f.tmp" "$real" \
      -H "User-Agent: Mozilla/5.0" \
      -H "Referer: https://global.suofeiya.com/" 2>/dev/null; then
    mv "$f.tmp" "$f"
    return 0
  fi

  rm -f "$f.tmp"
  echo "  ✗ $u (fetch failed)" >&2
  return 1
}

export -f fetch_one
export DEST

total=$(wc -l < "$LIST" | tr -d ' ')
echo "▶ Fetching $total images in parallel ($PARALLEL workers)" >&2

# Process in parallel using xargs
< "$LIST" tr -d '\r' | xargs -n1 -P "$PARALLEL" -I {} bash -c 'fetch_one "$@"' _ {}

ok=$(find "$DEST" -name '*.jpg' -size +5k | wc -l | tr -d ' ')
broken=$(find "$DEST" -name '*.jpg' -size -5k 2>/dev/null | wc -l | tr -d ' ')
echo "▶ Done: $ok real images · $broken skipped/broken" >&2
echo "▶ Total bucket size: $(du -sh "$DEST" | awk '{print $1}')" >&2
