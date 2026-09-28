# PRD: Pricing Simulator

**PRODUCT:** Pricing Simulator, a one-page web app for comparing pricing strategies.

**USER:** A founding team with an early product idea and very little data, who wants to compare a few pricing strategies before talking to customers about price.

**PROBLEM:** Teams often pick a price by gut feel, and only find out later that their heaviest customer loses them money, or that they need far more customers than they can get to break even.

**CORE USER STORY:** As a founder, I can describe my product, choose the pricing strategies I am considering, and enter my best guesses, so that I can see which strategy makes money, how many customers I need, and which guess matters most.

## The four steps the user moves through

1. **What kind of product is it?** Pick one of six: Software tool (Dropbox), AI tool (ChatGPT Plus), Marketplace (Airbnb, Etsy), Physical product (Warby Parker), Consumer subscription or app (Netflix, Spotify), Service business (a design agency). Then: who pays, businesses or consumers?
2. **Which pricing strategies do you want to compare?** Tick one or more: Subscription (Netflix), Tiers (Spotify Individual, Duo, Family), Freemium (Spotify Free and Premium), Pay per use (Uber, per ride), Commission (Airbnb, Etsy), One-time purchase (a video game).
3. **Your numbers.** Customers, costs, usage for a typical and a heaviest customer, competitor prices, what the problem is worth to the customer, and a price for each strategy. Each number carries a tag saying where it came from.
4. **Results.** For each strategy: profit, margin, customers needed to break even, and whether the heaviest customer loses you money. Then a comparison, three short written answers, and a PDF export.

## Features (build in this order)

1. **M1. Skeleton:** all four steps working for Subscription only (no source tags, hints, written answers or PDF yet).
   Done means: the app matches the Subscription column of the test case in CLAUDE.md.
2. **M2. All strategies:** every strategy, plus a comparison table.
   Done means: all three test case columns match, and ticking three strategies shows three result cards.
3. **M3. Sources, hints and export:** source tags, hints with a copy-research-prompt button, the three written answers, and Export PDF.
   Done means: Export PDF produces a clean one- or two-page PDF with the product type, every input and its source, the results, and the three answers.
4. **M4 (stretch). Two more views:** a price corridor, and a "which guess matters most" list.
   Done means: pricing below break-even visibly moves the marker out of the corridor, and the list reorders when the numbers change.

## Out of scope

Accounts, cloud saving, live competitor data, charts beyond the M4 corridor, taxes, currency conversion, customer acquisition cost, multi-year forecasts, and dynamic (surge) pricing.

## Data we store

Nothing on a server. The current inputs may be kept in the browser between visits.
