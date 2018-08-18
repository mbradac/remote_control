#!/usr/bin/env bash

# Taken from
# https://stackoverflow.com/questions/35283959/build-and-install-unsigned-apk-on-device-without-the-development-server

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

cd "$DIR"
react-native bundle \
  --dev false \
  --platform android \
  --entry-file index.js \
  --bundle-output ./android/app/build/intermediates/assets/debug/index.android.bundle \
  --assets-dest ./android/app/build/intermediates/res/merged/debug

cd android
./gradlew assembleDebug
cd ..

cp android/app/build/outputs/apk/app-debug.apk builds/
