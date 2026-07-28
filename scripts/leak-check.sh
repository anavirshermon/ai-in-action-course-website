#!/usr/bin/env bash
# Greps synced content/ for phrases that should only ever exist in instructor-only
# session files (never copied here). See To-Do Lists/Active/2026-07-28 - Course Website.md §2.
set -euo pipefail

SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTENT_DIR="$SITE_DIR/content"

# Zero legitimate use in student-facing docs — any hit blocks the sync.
HARD_PATTERNS=(
  "Optional / As Needed"
  "if you run short on time"
  "UG adjustment"
  "Instructor background"
)

# Can appear legitimately (e.g. the syllabus attendance policy says
# "no deduction" for excused absences) — printed for a manual look, not fatal.
WARN_PATTERNS=(
  "deduction"
)

failed=0

for p in "${HARD_PATTERNS[@]}"; do
  if grep -rIn --fixed-strings "$p" "$CONTENT_DIR" 2>/dev/null; then
    echo "LEAK CHECK FAILED: instructor-only phrase found: \"$p\""
    failed=1
  fi
done

for p in "${WARN_PATTERNS[@]}"; do
  hits=$(grep -rIn --fixed-strings "$p" "$CONTENT_DIR" 2>/dev/null || true)
  if [ -n "$hits" ]; then
    echo "REVIEW (not fatal): \"$p\" found —"
    echo "$hits"
  fi
done

if [ "$failed" -eq 1 ]; then
  echo ""
  echo "Leak check failed. Do not deploy. Fix the source file in the course folder and re-sync."
  exit 1
fi

echo "Leak check passed."
