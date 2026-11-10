#!/usr/bin/env bash
# Re-encodes the source clips into small, silent, web-ready loops.
#
#   bash scripts/optimize-videos.sh <folder-with-original-mp4s>
#
# For each clip it writes to public/videos:
#   name.mp4   H.264, plays everywhere
#   name.webm  VP9, smaller, used first where supported
#   name.jpg   poster frame, shown before (or instead of) the video
#
# Needs ffmpeg with libx264 and libvpx-vp9.
set -euo pipefail

SRC="${1:?Pass the folder that holds the original .mp4 files}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
mkdir -p "$OUT"

for f in "$SRC"/*.mp4; do
  name="$(basename "$f" .mp4)"
  # The clips play as small masked layers inside drawings, never full
  # screen, so they are kept short and small: at most 10 seconds, fitted
  # inside 720 x 720, 24 fps, no sound.
  vf="scale='if(gt(iw,ih),min(720,iw),-2)':'if(gt(iw,ih),-2,min(720,ih))',fps=24"
  ffmpeg -y -loglevel error -i "$f" -t 10 -an -vf "$vf" \
    -c:v libx264 -preset slow -crf 31 -pix_fmt yuv420p -movflags +faststart \
    "$OUT/$name.mp4"
  ffmpeg -y -loglevel error -i "$f" -t 10 -an -vf "$vf" \
    -c:v libvpx-vp9 -b:v 0 -crf 44 -deadline good -cpu-used 2 -row-mt 1 \
    "$OUT/$name.webm"
  ffmpeg -y -loglevel error -ss 1 -i "$f" -frames:v 1 -vf "$vf" -q:v 5 \
    "$OUT/$name.jpg"
  echo "$name: $(du -k "$OUT/$name.mp4" | cut -f1) KB mp4, $(du -k "$OUT/$name.webm" | cut -f1) KB webm"
done
