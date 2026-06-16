#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT/android"
SDK_DIR="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}"
KEYSTORE="$ANDROID_DIR/keystore/release.keystore"
PROPS="$ANDROID_DIR/keystore.properties"
KEYSTORE_PASS="${ANDROID_KEYSTORE_PASSWORD:-waterbets-release}"

if [[ ! -d "$SDK_DIR" ]]; then
  echo "Android SDK not found. Set ANDROID_HOME or install Android SDK." >&2
  exit 1
fi

echo "sdk.dir=$SDK_DIR" > "$ANDROID_DIR/local.properties"

if [[ ! -f "$KEYSTORE" ]]; then
  echo "Creating release keystore at android/keystore/release.keystore"
  mkdir -p "$(dirname "$KEYSTORE")"
  keytool -genkeypair -v \
    -storetype PKCS12 \
    -keystore "$KEYSTORE" \
    -alias waterbets \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$KEYSTORE_PASS" \
    -keypass "$KEYSTORE_PASS" \
    -dname "CN=Water Bets, OU=Mobile, O=Water Bets, L=Unknown, ST=Unknown, C=US"
fi

if [[ ! -f "$PROPS" ]]; then
  cat > "$PROPS" <<EOF
storeFile=keystore/release.keystore
keyAlias=waterbets
storePassword=$KEYSTORE_PASS
keyPassword=$KEYSTORE_PASS
EOF
fi

cd "$ROOT"
npm run build
npx cap sync android
cd "$ANDROID_DIR"
chmod +x gradlew
./gradlew bundleRelease

AAB="$ANDROID_DIR/app/build/outputs/bundle/release/app-release.aab"
if [[ -f "$AAB" ]]; then
  echo ""
  echo "Release AAB: $AAB"
  ls -lh "$AAB"
else
  echo "Build finished but AAB not found at expected path." >&2
  exit 1
fi
