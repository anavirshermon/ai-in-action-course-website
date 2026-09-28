You will build a small pricing simulator with Claude Code, then use it on your own venture. It asks what kind of product you have and which pricing strategies you are considering, takes your best numbers, and shows which strategy makes money, how many customers you need to break even, and whether your heaviest customer loses you money. You finish with a one-page PDF of your pricing decision.

You can build a small tool like this whenever you need to test an idea, in about the time it would take to set up a spreadsheet.

## Set up

1. Download the three files above.
2. Inside your team's project folder, create a folder called `tools/pricing-simulator/`.
3. Put `prd.md` and `CLAUDE.md` in it. (Please keep those exact names, because Claude Code looks for them.)
4. Open Claude Code in that folder and paste the prompt below.

<!-- prompt -->

From there, you are on your own. Build the milestones in order (they are in `prd.md`), check each one against the test case at the end of `CLAUDE.md`, and commit before starting the next. The test case is how you find out whether the math Claude wrote is right, so please do not skip it.

## Using it on your venture

Once M3 works, enter your own numbers. Tag each one honestly (Research, Interview, AI estimate or Guess). Your Session 4 competitor research and Session 5 interview notes are where most of the good numbers come from. Then answer the three questions on the results screen and export the PDF. Commit the PDF to your repo, because it feeds the pricing section of your Discovery Report.

## Stuck?

The trainer and your instructor are circulating, so please ask. These fixes usually work first:

- **Blank page:** "The page is blank. Check the browser console for errors and fix them."
- **Numbers do not match the test case:** paste both sets of numbers into Claude Code and ask which formula differs from CLAUDE.md.
- **Claude built more than you asked for:** "Remove anything not in this milestone of prd.md."
- **Messy PDF:** ask for a print stylesheet that hides the buttons and keeps each result card on one page.
