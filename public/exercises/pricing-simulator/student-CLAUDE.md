# CLAUDE.md: Pricing Simulator

This folder holds a small, separate tool. The rules here apply to everything in this folder, and take priority over any CLAUDE.md in a parent folder. Read `prd.md` for what to build.

## How to work

- Build one milestone at a time, in the order in `prd.md`. Do not start the next milestone until I say so.
- Build nothing from a later milestone or from the out-of-scope list, even if it would be easy.
- After each milestone, check the result against the test case below and tell me whether every number matches.
- If this folder is not inside a Git repository, run `git init` before the first commit.

## Technical limits

- One file, `index.html`, holding all HTML, CSS and JavaScript. It opens by double-clicking it.
- No framework, no build step, no server, no database, no login, no API key.
- The only outside request is loading Google Fonts. Fall back to system fonts when offline.
- PDF export uses the browser's print dialog (`window.print()`) with a print stylesheet. No PDF library.
- Inputs may be saved in `localStorage`, wrapped in try/catch, and the app must work without it.

## Look

- Calm and professional, like a finance tool. Off-white background, near-black text, one muted accent color, generous spacing.
- Fonts from Google Fonts: Fraunces for headings, IBM Plex Sans for text, IBM Plex Mono for numbers.
- A progress indicator for the four steps. Product types and strategies as selectable cards, each with its example.
- Money with two decimals and a thousands separator, percentages with no decimals, negative numbers in red.
- No sideways scrolling on a laptop screen.
- Print layout: no buttons or progress bar, a header with the product type and today's date, and no result card split across pages.

## Inputs

**Shared:** expected customers per month; fixed costs per month; cost per use (label follows product type, e.g., "AI cost per request", "materials and shipping per order", "staff cost per job"; zero allowed); uses per month for a typical customer; uses per month for the heaviest plausible customer; lowest and highest competitor price; value ceiling (the most a customer could reasonably pay per month, given what the problem costs them).

**Per strategy, shown only when ticked:** Subscription: price per month. Tiers: two or three tiers, each with a price and a share of customers (shares must total 100%). Freemium: paid price and percentage who pay. Pay per use: price per use. Commission: average sale value and commission rate. One-time purchase: price.

**Pre-select strategies by product type:** Software tool: Subscription, Tiers, Freemium. AI tool: Subscription, Tiers, Pay per use. Marketplace: Commission. Physical product: One-time purchase. Consumer subscription or app: Subscription, Freemium. Service business: Pay per use, One-time purchase. The user can change these.

**Source tag** on every input: Research, Interview, AI estimate, or Guess (default Guess).

**Hints** (M3), behind a small "?" on each input:
- Competitor prices: "Use the competitors from your Session 4 research and the competitor teardown in Handbook 7.3."
- Uses per month and value ceiling: "Use what your Session 5 interviewees said about how often the problem happens and what it costs them."
- Every input: a Copy research prompt button that copies: `Find realistic figures for [input] for a [product type] like ours: [one line about the product]. Give a range, a URL for every figure, and flag anything you could not verify.`

## The math (use exactly)

Per customer, per month:

- Cost per customer = cost per use × uses per month
- Profit per customer = revenue per customer − cost per customer
- Margin = profit per customer ÷ revenue per customer
- Total monthly profit = profit per customer × expected customers − fixed costs
- Customers to break even = fixed costs ÷ profit per customer, rounded up. Show "never" if profit per customer is zero or less.
- Break-even revenue per customer = cost per customer + (fixed costs ÷ expected customers)

Revenue per customer:

- Subscription: price
- Tiers: average of tier prices, weighted by share of customers
- Freemium: paid price × percentage who pay. "Customers" means all users, free and paid.
- Pay per use: price per use × uses per month
- Commission: average sale value × uses per month × commission rate. For a marketplace, a "use" is a sale.
- One-time purchase: price. "Customers" means units sold per month, and each unit is one use.

Heaviest customer check: rerun the per-customer lines with the heaviest customer's uses. For Tiers, the heaviest customer pays the top tier price. For One-time purchase, show "not applicable". Show it in red if negative.

## Results screen

One card per strategy: revenue, cost and profit per customer; margin; total monthly profit; customers to break even; break-even revenue per customer; heaviest customer profit. Below: a comparison table with the best strategy by total monthly profit highlighted. Then three text boxes: "Which strategy do we choose, and why?", "Which input are we least sure of?", "How will we check it before the Discovery Report?"

## M4 views

- **Price corridor:** a horizontal bar from break-even revenue per customer (left), through the competitor price range (middle), to the value ceiling (right), with the chosen strategy's revenue per customer marked. All monthly amounts.
- **Which guess matters most:** for the chosen strategy, move each input up and down 30%, one at a time, and list inputs by how much total monthly profit changes. Flag any input that flips profit from positive to negative.

## Test case

Software tool. Fixed costs $1,400. Cost per use $0.10. Typical customer 30 uses. Heaviest customer 150 uses. Expected customers 100.

| Output | Subscription at $10 | Pay per use at $0.50 | Freemium at $20, 10% pay |
| --- | --- | --- | --- |
| Revenue per customer | $10.00 | $15.00 | $2.00 |
| Cost per customer | $3.00 | $3.00 | $3.00 |
| Profit per customer | $7.00 | $12.00 | −$1.00 |
| Margin | 70% | 80% | −50% |
| Total monthly profit | −$700.00 | −$200.00 | −$1,500.00 |
| Customers to break even | 200 | 117 | never |
| Break-even revenue per customer | $17.00 | $17.00 | $17.00 |
| Heaviest customer profit | −$5.00 | $60.00 | −$13.00 |
