#!/usr/bin/env bash
# Copy repo-root app-assets/ into the Play Store editor screenshot paths.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/app-assets"
DEST="$ROOT/play-store-assets/public/screenshots/android/phone/en"

if [[ ! -d "$SRC" ]]; then
  echo "Missing $SRC — add iPhone captures from localhost:5174 first." >&2
  exit 1
fi

mkdir -p "$DEST"
cp "$SRC/localhost_5174_(iPhone XR) (5).png" "$DEST/01.png"
cp "$SRC/localhost_5174_(iPhone XR) (6).png" "$DEST/02.png"
cp "$SRC/localhost_5174_(iPhone XR) (7).png" "$DEST/03.png"
cp "$SRC/localhost_5174_(iPhone XR) (8).png" "$DEST/04.png"
cp "$SRC/localhost_5174_(iPhone XR) (7).png" "$DEST/05.png"
cp "$SRC/localhost_5174_(iPhone XR) (8).png" "$DEST/06.png"

if python3 -c "from PIL import Image" 2>/dev/null; then
  python3 <<PY
from pathlib import Path
from PIL import Image
dest = Path("$DEST")
bg = (252, 249, 248)
for name in ("01", "02", "03", "04", "05", "06"):
    p = dest / f"{name}.png"
    im = Image.open(p).convert("RGBA")
    flat = Image.new("RGB", im.size, bg)
    flat.paste(im, mask=im.split()[3])
    flat.save(p, "PNG")
PY
  echo "Flattened RGBA → RGB."
fi

echo "Synced app-assets → $DEST"
