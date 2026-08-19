# Session Report — AI in Action Course Website (ENTP 6314)

## 2026-07-28 — Built and shipped the course website end to end

**Operations:**
- Scaffolded Next.js/TypeScript/Tailwind site outside Dropbox; created public GitHub repo (`ai-in-action-course-website`, renamed from initial `entp6314-site`) and connected it to a new Vercel project for auto-deploy on push.
- Built the content-sync pipeline (`npm run sync`) pulling `00-`/`03-`/`04-`/`05-` from the Dropbox course folder into `content/`, gated by a leak-check script (now also wired as an `npm run build` prebuild step) that blocks instructor-only phrases from ever reaching the site.
- Created `05-Reading-Links-for-Students.md` in the course folder (student-facing reading URLs, since the instructor-only session files couldn't be read) and tagged 38 copy-paste prompts in the Handbook with ` ```prompt ` fences for the prompt library — both shown to the user for sign-off before editing.
- Built markdown parsers for the syllabus schedule, handbook, and assignment guide, plus every page: landing (grad/undergrad picker, cookie-based), home (This week panel, next deadline, build-arc timeline), sessions index + 14 session pages, and the full Resources section (Handbook, Assignments, Prompt library, Reference).
- Wired Announcements to a Google Sheet published-to-web CSV (`ANNOUNCEMENTS_CSV_URL`, set in Vercel across all three environments via CLI).
- Ran a UX/design review via the advisor (Opus) and implemented the approved findings: inline accordion on session rows (replacing a chevron that would have navigated away — caught a contradiction between the user's own two requests), mobile nav (previously nonexistent), Handbook sidebar mobile fix, external links open in new tab, consistent due-date styling, left-aligned landing page, editorial-list treatment on `/resources` and home's quick links, and a build-arc timeline that now shows two labeled spans instead of an undifferentiated strip.
- Archived two superseded files (`ENTP6314-Fall2026-Syllabus-DRAFT.docx`, the old Practicing-Your-Pitch folder) into `Archive Material/` in the course folder.

**Decisions:**
- Stayed on Vercel/Next.js instead of matching the sibling sites' Netlify/Vite pattern — the instructor explicitly wanted to learn Vercel this time.
- Track state lives in a cookie (not localStorage), read server-side via `next/headers` — lets track-dependent pages (e.g. Assignments weights) render correctly without client-side flicker.
- "Learning goal" and "what to bring," named in the original site plan, were dropped from session pages — that data only exists in the instructor-only session files, which the site is barred from reading.

**Commits:**
- `f644fdb` Initial commit from Create Next App
- `b5ff6a7` Build core site: landing, home, sessions, resources
- `8812218` Add Announcements page fetching from Google Sheet CSV
- `5c349f7` Change nav brand text from ENTP 6314 to AI in Action
- `865d377` UX/design pass: accordion sessions, mobile nav, editorial layout

**Status:**
- Done: Full site live at https://ai-in-action-course-website.vercel.app, all pages verified against real content, production build passes with the leak-check gate.
- Pending: (1) Google Sheet has its header row only — no announcements posted yet. (2) No instructor photo supplied yet; home page uses initials in a circle. (3) `content/`/`03-`/`04-` etc. need re-syncing (`npm run sync`) any time the instructor edits the Dropbox source docs, then commit + push to redeploy.

## 2026-08-10 — Handbook revision synced, schedule realigned to the Aug 10 syllabus PDF

**Operations:**
- Re-synced all four content files (`npm run sync`), carrying in a large revision of `03-Student-Guide-Building-with-AI.md` made in the course folder: git vs GitHub and commit vs push explained, code blocks labelled PROMPT/TERMINAL/FILE, project file-tree diagram, "You'll know it worked when" success criteria.
- Rewrote the Course Schedule in `00-` and the whole of `05-` in the course folder to match `Syllabus/ENTP6314-Fall2026-Syllabus-Manual-Aug10.pdf`, then synced. New module names (Foundations of AI, Discovery, Iterate and Extend, Pitch), Session 10 moved into Module 4, new session titles/topics/lab tasks.
- Extracted the PDF's embedded URLs programmatically rather than guessing link targets — recovered the four Requests for Startups links, Torres, Kawasaki, and Google's Prompting Guide.
- Fixed `renderInlineMarkdown` to handle `*italic*`, not just `**bold**`; applied it to reading labels on session pages and `/resources/reference`, which were showing literal asterisks.
- Leak check passed on every sync. `01-` and `02-` never copied.

**Decisions:**
- Updated the source docs in the course folder rather than hardcoding schedule data into the site, keeping `sync-content.sh` as the single bridge.
- Readings replaced wholesale per the PDF (instructor's call), and are now identical for both tracks. Track toggle kept for weights and minimums.
- MVP demo set to eight minutes for both tracks per the PDF, replacing seven grad / five undergraduate.
- Where the PDF contradicts itself, kept current values: Discovery Report 15% (PDF text says 20%, its own table says 15%) and pitch Q&A 4 minutes (PDF text says 5, table says 4).
- Did NOT remove the 11/4 build log checkpoint — the PDF omits it, but removing a graded checkpoint was left to the instructor.
- Merged `remove-landing-redirect` into main at the instructor's direction, so the track-picker-always-visible change shipped alongside this content update.

**Commits:**
- `5f37048` Sync revised handbook and PDF-aligned schedule (main, pushed)
- `8cf750a` Always show the track picker on the landing page (was unmerged, shipped with the above)

**Status:**
- Done: Deployed and verified live. All pages 200; handbook, Session 5/6/11 readings, and Session 4's Handbook Parts 7-8 link confirmed on the live site.
- Pending: (1) Google Sheet announcements still unwired. (2) No instructor photo. (3) Course-folder commits `145d086` and `50ef75b` sit on branch `handbook-beginner-revision`, not yet merged to that repo's main. (4) `01-` and `02-` (instructor-only, never published) now carry stale module names, readings, and demo timing. (5) Two tracked `Syllabus/*.docx` files show as deleted on disk in the course repo, unstaged, cause unknown.

## 2026-08-19 — Track-aware schedule, per-section filtering, monochrome redesign

**Operations:**
- Made the schedule track-aware. `syllabus.ts` now parses `## Course Schedule (Graduate)` and `## Course Schedule (Undergraduate)` separately and exposes `sessions`, `classMeeting`, and `courseCode` in the same `{grad, undergrad}` shape `evaluation` already used, plus `forTrack()` and `DEFAULT_TRACK`. `/home`, `/sessions`, `/sessions/[number]`, and `/resources/reference` read the existing track cookie.
- Added `filterTrackProse()` (`src/lib/content/track-prose.ts`): drops paragraphs and list items opening with the other section's `**Graduate.**` / `**Undergraduate.**` label and strips the label from the ones it keeps. Applied to every assignment body and the guide intro.
- Filtered the assignment list itself by whether that section's evaluation table carries a row, so Progress Week Meeting no longer appears for graduate readers.
- Redesign: replaced the UT Dallas green/orange-on-warm-paper palette with a neutral greyscale and swapped Fraunces + Public Sans for Instrument Sans throughout. Migrated ~155 color class usages across 15 files.
- Home: build-arc timeline replaced by a module timeline (four bands over the neutral ramp, session ticks now linking through, legend naming each module and range). Pre-semester panel no longer asks for a toolchain.
- Added the official syllabus PDFs to `public/syllabus/`, extended `sync-content.sh` to copy them, and linked them track-aware from `/home`, `/resources`, `/resources/reference`, and the nav.

**Decisions:**
- Two schedule tables rather than one with two date columns: Session 7 diverges in topic and content between the sections, so a shared row could not hold it.
- Readers without a track see the graduate schedule with a prompt to pick, and see both sections' prose with labels intact. Nothing is hidden from someone who has not chosen.
- `matchAssignment()` now links the assignment named *first* in a `Due` cell rather than whichever comes first in the guide. The final row names two, and `Array.find` was returning the wrong one.
- `parseArcRange` had been silently returning null for every arc: it matched "Weeks N and M" while the syllabus prose says "Sessions". Fixed before the arcs were removed, so the regression was not carried into the module timeline.
- No accent hue at all in the new palette, at the instructor's direction (no blue, no purple, nothing that reads as AI). Emphasis is weight and solid black fill; links are underlined ink.
- Instrument Sans chosen over Inter, Poppins, and Montserrat, which the instructor ruled out as template defaults.
- Left `/resources/reference` showing both evaluation tables when no track is picked, and the reader's own when one is.

**Results:**
- Verified by rendering the production build against both cookie values, not by trusting the build. Grad: 6 assignments, only 9/16, 10/21, 11/4, 12/9, 12-page report, 8-min demo, 10-min pitch, 6 interviews. UG: 7 assignments including Progress Week Meeting, only 9/15, 10/20, 11/3, 12/8, 8-page report, 6-min demo, 8-min pitch, 4 interviews. No "Not part of the … section" text anywhere.
- Confirmed against the compiled CSS that all nine old palette hexes and both old fonts are gone.
- All ten routes return 200 on both tracks. Both PDFs serve as `application/pdf`.
- Caught two regressions from the bulk color rename before shipping: both track buttons had flattened to identical solid black, and due dates had lost all emphasis. Track buttons are now solid/outlined; due dates are black pills.

**Commits:**
- `da98ab0` Make the schedule track-aware and sync the Aug 19 syllabi
- `7225bc4` Show each section only its own assignments and figures
- `1c9cade` Monochrome redesign, module timeline, and the syllabus PDFs

**Status:**
- Done: deployed to production and aliased to https://ai-in-action-course-website.vercel.app.
- Note: the Vercel GitHub integration does not auto-deploy this project. Every deploy so far has come from the CLI, and `vercel --prod` needs `--scope seaborne-toast` or it fails with "Not authorized".
- Note: production URLs are behind Deployment Protection, so an unauthenticated fetch of the deployment URL returns 302. Verification was done against the local production build.
- Open: the module timeline legend reads "Iterate and Extend", taken from the syllabus heading. The instructor wrote "Iterate & Extend"; not changed, since it would desync from the Course Structure table.
- Open, carried over: Google Sheet announcements still unwired; no instructor photo; `01-` and `02-` in the course folder still carry the pre-Aug-19 schedule and weights.
