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

# Exercises: the handout and prompt feed the Exercises page (content/), and the
# student files are served as downloads (public/). CLAUDE.md is copied under
# another name so it is never loaded as this repo's own CLAUDE.md.
sync_exercise() {
  local src="$COURSE_DIR/$1"
  local slug="$2"
  mkdir -p "$CONTENT_DIR/exercises/$slug" "$SITE_DIR/public/exercises/$slug"
  cp "$src/handout.md" "$src/prompt.md" "$CONTENT_DIR/exercises/$slug/"
  cp "$src/prd.md" "$src/student-CLAUDE.md" "$src/prompt.md" "$SITE_DIR/public/exercises/$slug/"
  echo "synced: exercise $slug"
}

sync_exercise "Session 06 (9-30) - Pricing and Business Models/Exercise 1 - Pricing Simulator" "pricing-simulator"

# The official syllabus PDFs are served directly from the site.
PDF_DIR="$SITE_DIR/public/syllabus"
mkdir -p "$PDF_DIR"
cp "$COURSE_DIR/Syllabus/ENTP6314-Fall2026-Syllabus-Graduate-Sept25.pdf" \
   "$PDF_DIR/ENTP6314-Fall2026-Syllabus-Graduate.pdf"
cp "$COURSE_DIR/Syllabus/ENTP4332-Fall2026-Syllabus-Undergraduate-Sept25.pdf" \
   "$PDF_DIR/ENTP4332-Fall2026-Syllabus-Undergraduate.pdf"
echo "synced: syllabus PDFs (graduate + undergraduate)"

echo ""
echo "Running leak check..."
"$SITE_DIR/scripts/leak-check.sh"
