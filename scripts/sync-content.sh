#!/usr/bin/env bash
# Copies the student-facing course docs into content/. This is the ONLY bridge
# between the Dropbox course folder and this repo — nothing else is ever read.
# Run this, then `git add -A && git commit -m "..." && git push` to update the live site.
set -euo pipefail

COURSE_DIR="/Users/anavirshermon/Library/CloudStorage/Dropbox/Teaching/ENTP - AI in Action/ENTP AI in Action Course"
SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTENT_DIR="$SITE_DIR/content"

mkdir -p "$CONTENT_DIR"

FILES=(
  "00-Syllabus-ENTP6314-Fall2026.md"
  "03-Student-Guide-Building-with-AI.md"
  "04-Assignment-Guide-for-Students.md"
  "05-Reading-Links-for-Students.md"
)

for f in "${FILES[@]}"; do
  cp "$COURSE_DIR/$f" "$CONTENT_DIR/$f"
  echo "synced: $f"
done

echo ""
echo "Running leak check..."
"$SITE_DIR/scripts/leak-check.sh"
