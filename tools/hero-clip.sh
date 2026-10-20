#!/usr/bin/env bash
# Prepares a hero background clip: silent, 720p, up to 12 s, in WebM (VP9) and MP4 (H.264).
# Usage: tools/hero-clip.sh path/to/original.mp4 nombre-del-clip [start-seconds]
set -euo pipefail
in="$1"; name="$2"; start="${3:-0}"
out="assets/hero"
mkdir -p "$out"
common=(-ss "$start" -t 12 -i "$in" -an -vf "scale=-2:720,fps=30")
ffmpeg -loglevel error -y "${common[@]}" -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 "$out/$name.webm"
ffmpeg -loglevel error -y "${common[@]}" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart "$out/$name.mp4"
ls -lh "$out/$name.webm" "$out/$name.mp4"
echo "Add to HERO_CLIPS in script.js:"
echo "  { src: [\"$out/$name.webm\", \"$out/$name.mp4\"], author: \"…\", source: \"Pexels\", url: \"…\" },"
