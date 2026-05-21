#!/usr/bin/env bash
# Re-fetch every CMS image that landed at <50 KB (thumbnails). The
# original CDN redirect URL often includes `x-oss-process=image/resize,...`
# which serves a thumbnail; stripping that param returns the
# full-resolution original.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/next-app/public/cms"
PARALLEL=12

upscale_one() {
  local f=$1
  local u
  u="$(basename "$f" .jpg)"

  # Fetch redirect HTML
  local redirect
  redirect=$(curl -fsS --max-time 20 "https://file.suofeiya.com.cn/v/$u" \
              -H "User-Agent: Mozilla/5.0" \
              -H "Referer: https://global.suofeiya.com/" 2>/dev/null) || {
    echo "  ✗ $u (cdn err)" >&2
    return 1
  }

  local real
  real=$(echo "$redirect" | grep -oE 'href="[^"]+"' | head -1 \
        | sed 's/href="//;s/"$//;s/&amp;/\&/g' \
        | sed -E 's/[?&]x-oss-process[^&]*//g')   # strip the oss-process param
  if [ -z "$real" ]; then echo "  ✗ $u (no href)" >&2; return 1; fi

  if curl -fsS --max-time 60 -o "$f.tmp" "$real" \
      -H "User-Agent: Mozilla/5.0" \
      -H "Referer: https://global.suofeiya.com/" 2>/dev/null; then
    local newsize old
    newsize=$(stat -f %z "$f.tmp" 2>/dev/null || stat -c %s "$f.tmp")
    old=$(stat -f %z "$f" 2>/dev/null || stat -c %s "$f")
    if [ "$newsize" -ge "$old" ]; then
      mv "$f.tmp" "$f"
      echo "  ✓ $u  $old → $newsize" >&2
    else
      rm -f "$f.tmp"
      echo "  · $u kept ($old vs $newsize)" >&2
    fi
    return 0
  fi
  rm -f "$f.tmp"
  echo "  ✗ $u (fetch err)" >&2
  return 1
}

export -f upscale_one

candidates=$(find "$DEST" -name '*.jpg' -size -50k)
total=$(echo "$candidates" | wc -l | tr -d ' ')
echo "▶ Upscaling $total thumbnails ($PARALLEL workers)" >&2

echo "$candidates" | xargs -n1 -P "$PARALLEL" -I {} bash -c 'upscale_one "$@"' _ {}

echo "▶ Done. New size distribution:" >&2
echo "  > 500 KB : $(find "$DEST" -name '*.jpg' -size +500k | wc -l | tr -d ' ')" >&2
echo "  100-500K : $(find "$DEST" -name '*.jpg' -size +100k -size -500k | wc -l | tr -d ' ')" >&2
echo "  5-100K   : $(find "$DEST" -name '*.jpg' -size +5k -size -100k | wc -l | tr -d ' ')" >&2
echo "  < 5K     : $(find "$DEST" -name '*.jpg' -size -5k | wc -l | tr -d ' ')" >&2
echo "  Total    : $(du -sh "$DEST" | awk '{print $1}')" >&2
