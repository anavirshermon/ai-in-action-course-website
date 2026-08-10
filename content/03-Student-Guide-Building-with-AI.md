# Building with AI
## The ENTP 6314 Handbook

*A working manual for people who have never built software*

---

## How to use this handbook

You do not need to know how to code to build a working product this semester. You need to know how to direct an AI that codes, and how to check its work. That second skill is the one this course actually grades.

This handbook is written to be read in order, once, early in the semester. After that it becomes a reference you open when you get stuck. Every part tells you which session it supports, so you can skip ahead when you need to.

Every grey box in this handbook has a label above it telling you where it goes. There are three kinds, and putting one in the wrong place is the most common day-one mistake.

| Label | What it is | What you do with it |
|---|---|---|
| **PROMPT** | Something you say to Claude Code | Copy it, replace the bracketed parts, paste it into Claude Code |
| **TERMINAL** | A command for your computer | Type or paste it into Terminal or PowerShell, then press enter |
| **FILE: name** | What a file should contain | This is what you are aiming for, not something to paste anywhere |

Prompts are starting points, not magic words. Change them when your situation is different.

Three more conventions used throughout:

**Do this** means it is required for a graded deliverable.
**Try this** means it is optional and usually worth it.
**Never** means it will cost you marks or break something.
**You'll know it worked when** tells you what to look for on screen, so you never have to guess whether a step succeeded.

---

## What you build, and when

The course has two building phases, and they have different purposes. Knowing which one you are in matters more than any technique in this handbook.

**Sessions 4 and 5 are probes.** You build small, fast, throwaway things: a landing page, a signup form, a fake pricing page. The purpose is not to build a product. The purpose is to find out whether anyone cares. You will throw most of this away, and that is the plan. Do not get attached.

**Sessions 6 through 9 are the product.** After your idea is locked, you build one real thing and improve it every week. This is the work that becomes your MVP demo at Session 10.

| Session | Date | What you build that week |
|---|---|---|
| 2 | 9/2 | Your first working app, whatever it is |
| 3 | 9/9 | Same app, but with project memory, save points, and a live URL |
| 4 | 9/16 | A landing page for each problem you are considering |
| 5 | 9/23 | Signup capture on those pages. Idea lock at the end of class. |
| 6 | 9/30 | The walking skeleton of your real product |
| 7 | 10/7 | Your first real feature, plus analytics |
| 8 | 10/21 | Your data layer and your AI feature |
| 9 | 10/28 | Fixes from user testing, then launch to real users |
| 10 | 11/4 | MVP Demo Day |
| 11 | 11/11 | Your pitch deck |
| 12 | 11/18 | Iteration and pitch rehearsal |
| 13 | 12/2 | Pitch Day. Nothing new is built |
| 14 | 12/9 | Refine. Venture Package due 12/11 |

---

## Contents

**Section 1: Getting started**
1. Setup
2. The five rules
3. The core loop
4. Project memory and the one-page PRD
5. Save points and putting it on the internet
6. Your build log

**Section 2: Finding what to build**
7. Research agents
8. Probes: landing pages and smoke tests
9. Talking to real people

**Section 3: Building the product**
10. Scoping and the walking skeleton
11. Making it a real application
12. Design and usability
13. Testing what you built
14. Shipping to real users

**Section 4: Showing the work**
15. The demo
16. The pitch

**Section 5: Reference**
17. Troubleshooting playbook
18. Glossary

---
---

# SECTION 1: GETTING STARTED

---

## Part 1. Setup

*Do this before Session 2, on 9/2.*

Set aside an hour. Most of it is waiting for things to install.

**1. Get a Claude account with Claude Code access.** The Pro plan is about $20 a month and is required course material, the same way a textbook would be. Sign up at claude.ai.

**2. Install VS Code.** It is free, at code.visualstudio.com. VS Code is just a window that shows your files. Think of it as Finder or File Explorer with better lighting. You will type notes into it, never code. Claude writes the code. You write things like your build log and your project's instructions file.

**3. Install Claude Code.** Open your terminal. On a Mac, press Cmd and Space, type "Terminal," and hit enter. On Windows, search for "PowerShell." Then paste the one line for your computer.

**TERMINAL**, Mac or Linux:

```
curl -fsSL https://claude.ai/install.sh | bash
```

**TERMINAL**, Windows PowerShell:

```
irm https://claude.ai/install.ps1 | iex
```

Copy only what is inside the box. **You'll know it worked when** the terminal stops scrolling and gives you back a normal blank prompt with no red text.

**4. Make a course folder and start Claude Code.**

**TERMINAL**

```
mkdir entp6314
cd entp6314
claude
```

A browser window will open to log you in. When it finishes, you have an AI software engineer running in your terminal.

**Where did that folder go?** Your terminal is always standing in one folder, the way a Finder window is always showing one folder. `mkdir entp6314` made a new folder inside wherever you were standing, and `cd entp6314` walked into it. If you ever lose track, type `pwd` and it tells you exactly where you are standing:

**TERMINAL**, with what it answers back:

```
pwd
/Users/yourname/entp6314
```

That is the same folder you would see in Finder under your name. Open Finder and look at it once now, so the terminal and the window on your screen connect to the same place in your head.

**What you will see when Claude Code wants to do something.** Claude Code asks permission before it edits a file or runs a command. You will see a prompt with the action and a yes or no choice. This is normal and it is not a warning that something is wrong.

- Editing files inside your own project folder, running the app, installing what it needs: approve these freely.
- Deleting things, or anything touching a folder outside your project: read it before you approve.

Saying no does not break anything. It just tells Claude to try something else.

**5. Create your accounts.**

| Account | What it is for | Needed by | Cost |
|---|---|---|---|
| **claude.ai** | Claude Code itself | Session 2, 9/2 | About $20 a month, Pro plan |
| **github.com** | The off-site copy of your project, and the link you hand in | Session 3, 9/9 | Free |
| **vercel.com** | Puts your app on the internet at a real URL | Session 3, 9/9 | Free tier |
| **formspree.io** | Collects email signups on your landing pages | Session 4, 9/16 | Free tier |
| **supabase.com** | Your database, once you need one | Session 8, 10/21 | Free tier |

Sign up for all of them now, even the later ones. It is ten minutes and it is done.

GitHub is worth one extra sentence, because you will hear the name all semester: it is a website that keeps a copy of your project, and it is where the "repo link" that assignments ask for comes from. You will barely visit the site. Claude Code talks to it for you. Part 5 explains what is actually happening.

### Every time you sit down to work

Your terminal does not remember where you were last time. It always starts at the top, in your home folder. So every session begins the same way: walk into the folder of the project you are working on, then start Claude Code.

**TERMINAL**

```
cd entp6314
cd first-app
claude
```

Replace `first-app` with whichever project you are working on that week. Part 4 shows the full layout, so you can see what lives where.

**You'll know it worked when** Claude Code starts and tells you the folder it is working in, and that folder is your project. From Session 3 on, once your project has a `CLAUDE.md` instructions file, it will also mention reading that file. If it does not, you are standing one level too high. Type `ls` to see what is around you, `cd foldername` to go in, and `cd ..` to go back up.

This is the single most common way students lose an evening. Claude with no project loaded will answer your questions and build things in the wrong place, and it will do it confidently.

### If the install fails

Do not fight it alone for an hour. The official documentation is at code.claude.com/docs. Or open regular Claude at claude.ai and ask:

**PROMPT**

```prompt
I am installing Claude Code on [Mac / Windows] and got this error:

[paste the entire error]

Explain the fix step by step. I am a beginner and I have never used a
terminal before.
```

Then bring it to class or the class channel. Debugging together earns participation credit.

### The eight commands you type by hand

Everything more complicated than these, Claude Code runs for you. You will use these all semester.

| Command | What it does |
|---|---|
| `cd foldername` | Go into a folder |
| `cd ..` | Go back up one level |
| `ls` | List the files here. On Windows, `dir` |
| `pwd` | Tell me where I am |
| `mkdir name` | Make a new folder |
| `clear` | Clean up the screen |
| up arrow | Repeat your last command |
| `claude` | Start Claude Code |

A terminal looks intimidating because it is mostly black and has no buttons. It is a text conversation with your computer. You already know how to have a text conversation.

### Two windows, one screen

The same black window does two different jobs, and telling them apart matters.

| You are in | How you can tell | What you type |
|---|---|---|
| **The terminal** | A short prompt ending in `$` or `>` | The eight commands above |
| **Claude Code** | It started after you typed `claude`, and it answers in sentences | Plain English, and slash commands |

Slash commands are instructions to Claude Code itself rather than requests to build something. There are only two you need:

| Command | What it does |
|---|---|
| `/init` | Creates your project's `CLAUDE.md` instructions file. Part 4 |
| `/compact` | Clears out the clutter when a long session starts going in circles. Part 4 |

To leave Claude Code and go back to the plain terminal, type `/exit`.

---

## Part 2. The five rules

*Session 2, on 9/2. Read this twice. Everything else in the handbook depends on it.*

### Rule 1: Small steps beat big asks

"Build my whole app" produces a tangle you cannot debug. "Add a signup form to the homepage" produces progress you can see.

One feature per request. Always.

The reason is not that AI cannot handle a big request. It often can. The reason is that when a big request goes wrong, you have no idea which part broke, and neither does the AI. Small steps mean small failures.

### Rule 2: Always be able to go back

Commit after every working feature. A commit is a save point, a snapshot of your whole project that you can return to later. Claude Code makes them for you when you ask.

**PROMPT**, after every working feature:

```prompt
Commit this with a sensible message.
```

**PROMPT**, when something breaks:

```prompt
The app was working thirty minutes ago and now it is broken. Show me the
recent commits and revert to the last working one.
```

That is the whole mechanism. Part 5 explains what is happening underneath and how to get a copy off your laptop, and it is your reading for Session 3.

The confidence that you can undo anything is what makes non-programmers brave. Students who commit often try bolder things, because the worst case is losing twenty minutes.

### Rule 3: Never trust, always run

After every change, open the app and click the thing. "Claude said it works" is not evidence that it works.

If you do not know how to open your app yet, that is the first thing to fix:

**PROMPT**

```prompt
How do I see this in my browser?
```

This is the single most important skill in this course. AI models will tell you a feature is complete, that tests pass, that a bug is fixed. Sometimes they are right. When they are wrong, they are wrong confidently and in detail. The only defence is looking with your own eyes.

You will be graded on this. One of your build log entries has to describe a time AI was confidently wrong and you caught it.

### Rule 4: Never paste secrets

No passwords. No API keys in chat messages. Nothing sensitive in code that goes to GitHub.

If a service gives you something it calls a "secret key," tell Claude Code:

**PROMPT**

```prompt
Store this in an environment variable, not in the code. Then show me how
to confirm it is not going to end up on GitHub.
```

An environment variable is a place to keep a secret outside your code. In practice it means two files do the work, and you should look at both with your own eyes rather than accept "done."

| File | What is in it | Who sees it |
|---|---|---|
| `.env.local` | Your actual key | Only your laptop |
| `.gitignore` | A list of files to leave out of the project's history | Everyone, which is fine, it holds no secrets |

**You'll know it worked when** `.gitignore` contains a line reading `.env.local`, and your key appears nowhere else when you search the project for it. Ask Claude Code to show you both files and to search for the key. Read the answer yourself. This is the one mistake in the handbook with consequences outside this course.

### Rule 5: When stuck for twenty minutes, change strategy, not volume

Do not send the same prompt again, louder. Do not add "please" and "it is very important." If two attempts have failed, the approach is wrong, not the wording.

Part 17 has the full troubleshooting playbook. The short version: stop patching, ask for a diagnosis from scratch.

---

## Part 3. The core loop

*Session 2, on 9/2.*

Every session with Claude Code follows the same rhythm. Learn it once and you can build anything in this course.

**Describe, Plan, Approve, Build, Run, Inspect, Iterate.**

### Describe

Say what you want in terms of what a person experiences.

Good: "A page where a visitor types their monthly expenses and sees a pie chart."

Bad: "Implement a React component with a state hook that renders a Chart.js canvas."

You are not the engineer. You are the person who knows what it should do. Describe the outcome and let the engineer choose the tools.

### Plan

Press Shift and Tab together to switch Claude Code into Plan mode. **You'll know it worked when** a plan mode indicator appears on screen. It is a toggle, so pressing it again turns it back off. If nothing seems to happen, do not press it repeatedly. Just say it instead:

**PROMPT**

```prompt
Before writing any code, give me a plan and wait for my approval.
```

Then read the plan the way a manager reads a proposal from a new hire. Does it match what you asked for? Is it doing something extra you did not want? Is it about to install four things you have never heard of?

Catching a mistake in the plan costs you thirty seconds. Catching it in the code costs you an hour.

### Approve

Say yes, or say what to change. Then let it build.

### Run

Ask:

**PROMPT**

```prompt
How do I see this in my browser?
```

What happens next depends on what Claude built, and both answers are correct:

| If Claude built | You will | And you will see |
|---|---|---|
| Plain HTML in one folder, like your first app | Double-click `index.html`, or ask Claude to open it | Your page in a browser tab |
| A Next.js app, which is what your real product uses | Run the command it gives you, usually `npm run dev` | A link like `localhost:3000` to click |

`localhost` means the app is running on your own machine only. Nobody else can reach that link. Putting it somewhere strangers can reach is Part 5.

### Inspect

Click everything. Type nonsense into the fields. Press the back button. Try to break it.

### Iterate

Report what you saw, specifically. "It's broken" gives the AI nothing to work with.

Good: "The chart appears, but the numbers do not update when I edit an expense. The old value stays until I refresh the page."

You can paste screenshots directly into Claude Code. A screenshot of a broken screen is worth a paragraph of description.

### Your first app

Use this in the Session 2 lab:

**PROMPT**

```prompt
I have never built software before. I want a simple one-page web app:
[a tip calculator / my personal homepage / a packing list maker].

Use the simplest possible technology: plain HTML, CSS, and JavaScript in
one folder. No frameworks.

Give me a plan first. After building, tell me exactly how to open it in
my browser.
```

Then improve it three times using the loop. That is it. You are a builder now. The rest of the semester is the same loop applied to harder problems.

---

## Part 4. Project memory and the one-page PRD

*Session 3, on 9/9.*

Claude Code starts every session with no memory of the last one. Two files fix this.

Before either of them, start the way you always start, standing inside the project you are working on:

**TERMINAL**

```
cd entp6314/first-app
claude
```

### Where everything lives

From here on, the handbook keeps telling you to put things "in your project folder." This is what it means. `entp6314` is the course folder you made in Part 1, and each project gets its own folder inside it:

**FILE LAYOUT: your course folder by the end of the semester**

```
entp6314/
  first-app/               <- Sessions 2 and 3, your practice project
    CLAUDE.md              <- project memory (Part 4)
  probe-idea-1/            <- Sessions 4 and 5, throwaway
  probe-idea-2/            <- throwaway
  my-product/              <- your real product, from Session 6 on
    CLAUDE.md              <- project memory (Part 4)
    prd.md                 <- your one-page PRD (Part 4)
    build-log.md           <- graded, weekly (Part 6)
    qa-report.md           <- required for the MVP demo (Part 13)
    .env.local             <- your secret keys, never leaves your laptop (Rule 4)
    research/              <- reports the research agents write (Part 7)
    interviews/            <- one file per interview (Part 9)
```

Three things to notice. Each project folder has its own `CLAUDE.md`, which is why you have to start Claude Code from inside the right one. Your graded work lives in the real product folder, not in a probe folder, because the probes get thrown away. And you make none of these by hand. Ask Claude Code for them and it creates them where they belong.

### CLAUDE.md

This is a file Claude Code reads automatically at the start of every session. It is your project's standing instructions.

Create it by typing `/init` inside Claude Code. That is a slash command, an instruction to Claude Code itself rather than a request to build something. Then open the file in VS Code and edit it to look like this. Editing this file is notes, not code, so it is yours to write:

**FILE: CLAUDE.md**

```
# Project: [name]

## What this is
[Two sentences: who it is for, what problem it solves]

## Stack
[Claude fills this in, for example: Next.js + Supabase + Vercel]

## Rules
- Explain changes in plain English. I am not a programmer.
- Prefer the simplest solution that works.
- Ask before adding any new service or library.
- After each feature, remind me to commit.

## Current focus
[Update this weekly: the one feature we are working on]
```

Update the "Current focus" line every week. It is thirty seconds of work and it stops Claude from wandering off into parts of the project you are not touching.

**You'll know it worked when** you quit Claude Code, start it again from the same folder, and it mentions reading `CLAUDE.md`. If it never mentions the file, you are starting it from the wrong folder. Check with `pwd`.

### When Claude starts going in circles

Long sessions get worse, not better. Claude Code has a limited amount of short-term memory, and a session full of dead ends fills it with clutter. When answers start repeating or drifting, type `/compact` to clear it out, or quit and start fresh.

Neither one loses your work. Your files are on disk and your commits are save points. And because `CLAUDE.md` is read automatically at the start of every session, a fresh session already knows what matters.

### The one-page PRD

PRD stands for Product Requirements Document, which sounds more corporate than it is. It is one page describing what you are building, written before you build it.

You will write your real one before Session 6, when you build the walking skeleton. Save it in your project folder as `prd.md`, because later prompts ask Claude Code to read it by that name. Learn the format now.

**FILE: prd.md**

```
PRODUCT: [name]

USER: [a specific person, not a category]
  Good: "freelance photographers with 5 to 50 clients"
  Bad: "small businesses"

PROBLEM: [one sentence]

CORE USER STORY:
  As a [user], I can [action] so that [outcome].

FEATURES (maximum 3):
  1. [feature] - done means: [something you can observe]
     Example: "user submits the form and sees a confirmation message"
  2. ...
  3. ...

OUT OF SCOPE (the v2 parking lot):
  [Everything else you are tempted by. Write it down so you can stop
  thinking about it.]

DATA WE STORE:
  [Plain English. "Users. Each user has projects. Each project has
  photos and a status."]
```

Two things make a PRD useful rather than decorative.

**The "done means" clause.** If you cannot describe how you would observe that a feature works, you cannot tell whether the AI finished it. Vague acceptance criteria are how you end up with a feature that is 90 percent done forever.

**The out-of-scope list.** Writing down what you are not building is what stops you from building it. Every team in this course tries to build too much.

When you have a PRD, paste it into Claude Code in Plan mode, read the plan it produces, and build feature one only.

---

## Part 5. Save points and putting it on the internet

*Session 3, on 9/9.*

### Two words that sound like one thing

**Git** and **GitHub** are different things that share a syllable, and mixing them up is the most common confusion in this Part.

Git is a save-point system that runs on your laptop. It keeps a numbered history of your project, and it lets you go back to any point in that history. It is entirely local. Turn off the wifi and git still works.

GitHub is a website that holds a copy of that history. It is what makes your work survive a dead laptop, and it is where the "repo link" that assignments ask for comes from.

Staying with the restaurant analogy this handbook uses later: git is the notebook in the kitchen where you write down every version of the recipe. GitHub is the photocopy you keep off-site, in case the kitchen burns down.

You never need to learn git commands. Claude Code runs them for you. What you need is to know which of the two you just did.

### Commit, then push

These are two separate actions. Doing one is not doing the other.

| | Commit | Push |
|---|---|---|
| What it does | Records a save point | Sends your save points to GitHub |
| Where the copy lives | Your laptop only | GitHub's servers |
| How often | After every working feature | At least once per work session |
| What breaks if you skip it | You cannot go back | Your laptop dies and the work is gone |

Read the last row twice. A student who commits diligently all semester and never pushes has no backup at all, and feels completely safe. This happens every year.

**PROMPT**, after every working feature:

```prompt
Commit this with a sensible message.
```

**PROMPT**, at least once per work session:

```prompt
Push this to GitHub.
```

**PROMPT**, the very first time, instead of the one above:

```prompt
Create a GitHub repository for this project and push it. Make the
repository private. Walk me through any login steps.
```

**Never** create a public repository for your course project. Public means anyone can read every file, including any secret key that slipped through Rule 4. Private is one click at creation time and it is the default you want. You can share a private repo with an instructor without making it public.

### What this actually looks like

Ask Claude Code to show you the history. The exact formatting varies, but you get a list like this, one line per commit, newest at the top:

**PROMPT**

```prompt
Show me my recent commits.
```

What comes back:

```
a4f2c91  Add email signup form to landing page      12 minutes ago
7b3e8d5  Fix chart not updating after edit          1 hour ago
2c9a1f7  Add expense pie chart                      2 hours ago
e81b4a3  First working version                      yesterday
```

That is the undo list. "Revert to the last working one" means going back to one of those lines. The messages are why you ask for sensible ones. At Session 9 you will be reading this list looking for the moment before things broke.

**PROMPT**, when something breaks:

```prompt
The app was working thirty minutes ago and now it is broken. Show me the
recent commits and revert to the last working one.
```

**You'll know the push worked when** you open github.com in a browser, click your repository, and see your files listed with those same commit messages beside them. Do this the first time. Claude Code saying "pushed successfully" is exactly the kind of claim Rule 3 exists for.

**Never** go a whole session without committing. The one time you do is the time you will need it.

### Your git history is graded

This is not just housekeeping. The commit history is one of the artifacts this course assesses, alongside your build log, because it shows how you worked rather than what you ended up with. A history of small, frequent, sensibly labelled commits looks like someone taking steady steps. One enormous commit at midnight looks like what it is.

You also hand in the repository link three times: with the First App on 9/16, with the MVP demo on 11/4, and with the final package on 12/11. That link is the GitHub web address of your project.

### Deploying gets you a real URL

Deploying is a third thing, and it is not pushing. Push sends your code to GitHub, where it is stored. Deploy sends your app to Vercel, where it runs and strangers can use it.

| Action | Destination | Result |
|---|---|---|
| Commit | Your laptop | A save point |
| Push | GitHub | A backup, and your repo link |
| Deploy | Vercel | A live URL anyone can open |

**PROMPT**

```prompt
Deploy this app to Vercel. Walk me through it step by step. I have never
done this before.
```

The first time takes about fifteen minutes of following instructions. It will ask you to connect your GitHub account, because Vercel takes the code from your repository. That is the first time the two halves visibly connect.

**You'll know it worked when** Vercel gives you a URL ending in `.vercel.app`, you open it on your phone, and your app appears. Text it to a friend. If it works for them, it is really deployed.

After the first time, it is one command.

This matters more than it sounds. A live URL turns your idea from something you describe into something a stranger can use. That is the difference between asking someone whether they would like your product and watching whether they sign up. The second one is evidence. The first one is conversation.

---

## Part 6. Your build log

*Starts Session 4, on 9/16. Runs every week until the end of the course.*

The build log is your own record of what you did. It is individual, not shared with your team. Each person keeps their own.

It is graded twice: a checkpoint on 11/4 with the MVP demo, and a final pass on 12/11.

At the final pass you mark your best entries and annotate each one. **Graduate section: four entries. Undergraduate section: three.**

### Why it exists

This course cannot grade your code, because AI wrote most of it. What it can grade is your judgment: what you tried, what broke, how you recovered, and whether you noticed when the AI was wrong.

The build log is the evidence of that. A student who describes three failed approaches and a recovery is demonstrating more skill than a student who reports that everything worked.

### The format

One entry a week. Five minutes. Keep it in a file called `build-log.md` in your real product folder, not in a probe folder, because the probes get thrown away and this is graded.

**FILE: build-log.md**

```
## [date]

Tried:
  [What you set out to do this week]

Broke:
  [What went wrong. If nothing went wrong, you did not try hard enough.]

Fixed by:
  [What actually worked, including the dead ends]

Learned:
  [Something you did not know last week]

Next:
  [What you are doing next week]
```

### What makes an entry good

The test is whether someone reading it could tell it was you who wrote it.

**Weak:** "Worked on the signup form. Had some issues but fixed them. Learned about databases."

**Strong:** "Tried to add email signup. Claude built it and said it was working. The form submitted and showed a success message, but no emails were arriving in Supabase. Claude insisted the code was correct. I checked the Supabase dashboard directly and the table was empty. Turned out it had created the table with a different name than the code was writing to. Lesson: a success message in the browser proves nothing about what happened in the database."

The second one takes four minutes to write and is worth several times the first one.

### The one entry that must exist

At least one of your entries has to describe **a time AI was confidently wrong, you caught it, and what it would have cost you if you had not.**

This is the whole course in one paragraph. Do not leave it until December. Write it the week it happens, because you will forget the details.

---
---

# SECTION 2: FINDING WHAT TO BUILD

---

## Part 7. Research agents

*Session 4, on 9/16.*

Claude Code is not only for writing code. It can search the web, read what it finds, and write reports into files you keep. That makes it a research assistant that works at a speed you could not match.

It also makes things up. Both of these are true at once, and managing that is the skill.

**The iron rule: every factual claim gets a URL.** AI invents facts confidently. Made-up citations look exactly like real ones. You are graded on its errors as if they were your own, because they are.

The prompts below all end by telling Claude Code to write its report into a `research/` folder inside your project. You do not need to create that folder first. Claude makes it.

### 7.1 Opportunity scan

**PROMPT**

```prompt
You are a market research analyst. Research this problem space:
[for example, "small landlords managing maintenance requests"].

1. Who has this problem? Estimate how many such people or businesses
   exist in the US. Show your reasoning and your sources.
2. What do they use today? List tools, spreadsheets, and manual
   workarounds.
3. Search Reddit, G2, Capterra, and app store reviews for complaints
   about current solutions. Quote 10 real complaints with links.
4. Why might this be newly solvable with AI in 2026? Be specific about
   which capability changed and when.

Write the findings to research/opportunity-scan.md with a source URL for
every claim. Flag anything you could not verify.
```

### 7.2 Complaint mining

The fastest way to find a real problem is to read people complaining about the one they have. Three places are consistently productive.

**Review sites.** G2, Capterra, and app store reviews for the tools your users already pay for. Filter to one and two stars. People are specific when they are angry.

**Reddit and forums.** Search for the workaround, not the product. People post "how do I keep track of X in a spreadsheet" long before they look for software.

**Job postings.** If companies are hiring humans to do something repetitive, that is a job someone would pay software to do.

**PROMPT**

```prompt
Search for complaints about [category of tool] from the last 18 months.
Look at G2, Capterra, app store reviews, and Reddit.

Group the complaints into themes. For each theme: how often it comes up,
three verbatim quotes with links, and whether it is a product problem or
a pricing problem.

Then search job postings for roles that involve [the task]. What are
companies paying humans to do here, and how much?

Write to research/complaints.md.
```

**Watch the workarounds.** When you find people using a spreadsheet plus email plus a group chat to do one job, that is a product waiting to exist. Workarounds are the clearest signal in customer research, because nobody builds a workaround for a problem they do not have.

### 7.3 Competitor teardown

**PROMPT**

```prompt
Research these competitors: [list them, or say "find the top 5 products
that do X"].

For each one: pricing taken from their pricing page with a link, three
core features, target customer, funding if it is public, and the three
most common complaints in their reviews, quoted and linked.

Output a comparison table in research/competitors.md.

Then answer: what does nobody serve well?

Mark any claim you inferred rather than verified with [UNVERIFIED].
```

### 7.4 Market sizing, bottom up only

**PROMPT**

```prompt
Help me size the market bottom up for [product] at [price] per month.

Number of [target customers] in the US, times a plausible adoption
percentage, times price.

Use a real source for the population number. Give a conservative, base,
and optimistic case. State every assumption in a table I can defend to
an investor.

Do not use top-down logic. "One percent of a fifty billion dollar
market" is not a market size.
```

### 7.5 The "why now" test

Every venture that works has a reason it could not have been built three years ago. For AI ventures the reason has to be specific. "AI is big" is not a reason.

**PROMPT**

```prompt
I claim [product] is newly possible because [specific AI capability].

Find evidence for and against. Look at benchmark results, product
launches, and adoption data from the last 18 months.

Then argue the strongest version of both counterarguments:
1. "This was already possible five years ago."
2. "This still is not possible."

I want to test my claim, not confirm it.
```

### The verification pass

**Do this after every research agent run.** Open five of the cited links yourself, chosen at random. If one is broken, or does not say what the report claims it says, redo that section.

Budget fifteen minutes. It is the difference between research and fiction, and it is the thing that separates a Discovery Report that scores well from one that does not.

---

## Part 8. Probes: landing pages and smoke tests

*Sessions 4 and 5, on 9/16 and 9/23.*

### What a probe is

A probe is a small, fast, public thing you build to find out whether anyone cares. It is not a product. It is an instrument for collecting evidence.

You will build two or three of them, one per problem you are considering. Most of them will fail, which is the point. Failing in week 4 costs you an evening. Failing in week 11 costs you the semester.

**These are meant to be thrown away.** Do not spend a weekend on visual polish. Do not add a database. Do not build features. Build the smallest credible page that could make someone give you their email address.

### Why this works

Your own evidence hierarchy, from weakest to strongest:

1. Opinions ("that sounds useful")
2. Interview quotes ("I spend two hours a week on this")
3. Observed behavior (they actually clicked)
4. Time or money already spent on a workaround
5. Pre-orders, letters of intent, waitlist signups

A conversation gets you level one or two. A landing page gets you level three and sometimes level five. That is why you build before you finish interviewing, not after.

### 8.1 Build the landing page

**PROMPT**

```prompt
Build a one-page landing site for [product idea].

Include: a headline that states the problem, three benefit bullets, one
screenshot placeholder, and an email signup form.

Store the emails using Formspree, which needs no database. Do not set up
a database for this.

Add Vercel Analytics so I can see visits.

Make it look credible, not fancy. Then deploy it to Vercel and give me
the URL.
```

Formspree is deliberate. You do not learn databases until Session 8, and a probe does not need one. If you find yourself wanting a database in week 4, you are building a product instead of a probe.

### 8.2 Get people to it

A landing page nobody visits tells you nothing. You need somewhere between fifty and a few hundred visitors to learn anything.

Where to put it:

- The two or three online communities where your users actually spend time. Read each community's self-promotion rules first and follow them. Getting banned is not evidence.
- Relevant subreddits, where you should participate honestly rather than drop a link.
- People you already know who fit the profile. Ask them to share it, not to sign up.
- A small paid test if you have twenty dollars and want faster data.

**Never** buy email lists, use fake testimonials, or claim the product exists when it does not. Say it is coming. A waitlist is honest. A fake product is not, and in this course it is an integrity issue.

### 8.3 Read the result honestly

**PROMPT**

```prompt
Here is the traffic and signup data from my landing page: [paste].

Calculate the conversion rate. Then tell me honestly what this does and
does not prove. What would I need to see before concluding that this
problem is worth building for?

Argue the pessimistic interpretation first.
```

Rough guidance for a landing page from a cold audience: under two percent signup is weak, two to five percent is worth a second look, above five percent is a real signal. These are rough. What matters more is comparing your two or three probes against each other, since they share the same traffic sources.

**A probe with zero signups is a finding, not a failure.** Report it. The Discovery Report rubric explicitly credits what did not work. Teams that hide a dead probe and pretend they were always committed to the surviving idea score worse than teams that show the graveyard.

---

## Part 9. Talking to real people

*Session 5, on 9/23. Interviews are due 10/14.*

AI prepares and synthesizes. Humans validate.

**Synthetic interviews are inadmissible as evidence in this course.** You may use AI to rehearse against a fake customer. You may never count that as data. This is a hard rule and it is graded.

Minimums, all due 10/14 with the Discovery Report:

| | Interviews required |
|---|---|
| Graduate team | 8 |
| Undergraduate team | 5 |
| Graduate working alone | 6 |
| Undergraduate working alone | 4 |

### 9.1 Draft the interview guide

**PROMPT**

```prompt
I am doing customer discovery for [idea], targeting [user].

Draft a 20-minute interview guide following The Mom Test rules:
- Do not pitch my idea
- Ask about their life and their past behavior
- No hypothetical "would you use this" or "would you pay" questions

Cover: their current workflow, the last time the problem happened, what
it cost them, what they have already tried, and what they pay for today.

Then review your own guide and flag every leading question you wrote.
```

That last line matters. AI writes leading questions by default, because it is trying to be helpful about your idea. Asking it to attack its own draft catches most of them.

### 9.2 Rehearse against an AI customer

This is practice. It is not data.

**PROMPT**

```prompt
Role-play a [busy restaurant owner in Dallas]. You are skeptical, busy,
and slightly annoyed at being pitched another app. Do not be agreeable.

I will practice my customer interview on you. Stay in character.

Afterwards, break character and grade me. Where did I pitch instead of
listen? Where did I ask leading questions? What did I fail to follow up
on?
```

### 9.3 During the real interview

Three rules that are harder than they sound.

**Talk less than the other person.** Aim for the interviewee speaking eighty percent of the time. If you are explaining your idea, you are not doing research.

**Ask about the last time, not about generally.** "When did this last happen?" gets you a story with details. "How often does this happen?" gets you a guess.

**Follow the emotion.** When someone gets animated, annoyed, or suddenly specific, stop your script and ask why. That is where the real problem lives.

**Get consent before recording.** Say what you are recording, what you will do with it, and who will see it. If they say no, take notes instead. Consent is not a formality here, because these are real people and you are storing what they said.

### 9.4 Synthesize what you heard

After each interview, write or dictate your notes into a file: `interviews/person-1.md`, `person-2.md`, and so on. Do this the same day, while you still remember which things mattered.

If you recorded with consent, you can transcribe:

**PROMPT**

```prompt
Transcribe this recording into interviews/person-N.md. Keep the exact
wording. Do not clean up the grammar or summarize. I need the verbatim
quotes.
```

Then, once you have several:

**PROMPT**

```prompt
Read all files in interviews/.

Extract across ALL interviews:
1. Recurring pains, ranked by how often they came up and how intense
   they were, with verbatim quotes for each
2. Current workarounds people described
3. Any evidence of willingness to pay: money or time already spent
4. Statements that CONTRADICT our idea. Do not soften these. Quote them
   exactly.
5. What we should ask better next time

Write to research/interview-synthesis.md. Tag each finding with which
interviews it came from.
```

Point four is the one that matters. AI is agreeable by default and will happily assemble a case that your idea is great. Asking explicitly for disconfirming evidence is the only reliable way to get it.

**Try this** as a follow-up:

**PROMPT**

```prompt
Now argue that our idea is wrong, using only the interview evidence.
Build the strongest case you can that we should not build this.
```

If the AI cannot build that case from your interviews, either your idea is unusually well supported or you have not interviewed enough people. It is usually the second one.

### 9.5 Surveys

Surveys are weaker than interviews and much weaker than behavior. Use them to test something specific across more people, after interviews have told you what to ask.

**PROMPT**

```prompt
Draft a 6-question survey testing [specific hypothesis].

Rules: no leading questions, no double-barrelled questions, no questions
about hypothetical future behavior. Ask about what they have actually
done.

Then review your own draft and flag every question that violates those
rules.
```

---
---

# SECTION 3: BUILDING THE PRODUCT

---

## Part 10. Scoping and the walking skeleton

*Session 6, on 9/30.*

Your idea is locked. Now you build the real thing, and the first job is deciding what "the real thing" is.

### The cut list

Every team wants to build too much. Do this exercise in class:

1. List ten features you imagine your product having.
2. Cut to three.
3. Cut to one core feature plus two supporting ones.
4. Everything else goes on the out-of-scope list in your PRD.

The features you cut are not gone. They are in the parking lot, where they belong until you have evidence anyone wants them.

### MVP means minimum testable, not minimum

An MVP is not a bad version of your product. It is the smallest thing that tests your central assumption.

Ask: what is the one workflow that proves the value hypothesis from your Discovery Report? Build that. Nothing else.

### Wizard of Oz is legitimate

If the hard part of your product is genuinely hard, do it manually at first and automate later. This is a real technique with a real history. DoorDash's founders delivered the food themselves. Users do not care whether a human or a machine is behind the curtain, as long as the job gets done.

If your AI feature is not working after two sessions of trying, replace it with yourself for now, and say so in your demo. A working product with a human in the loop beats a broken product with an ambitious architecture.

### The walking skeleton

Before you make anything good, make something that works end to end, badly.

A walking skeleton is the thinnest possible version where a user can complete the core action from start to finish. Ugly is fine. Slow is fine. Missing everything except the one path is fine.

The reason is that end-to-end problems are the expensive ones. If you build a beautiful front end for three weeks and then discover the data model does not work, you have lost three weeks. If you connect everything badly on day one, you find that problem immediately.

**PROMPT**

```prompt
Read CLAUDE.md and prd.md. We are building the MVP.

Propose the simplest architecture using Next.js, Supabase, and Vercel.

Then build a walking skeleton: the thinnest possible end-to-end version
where a user can [core action]. Ugly is fine. Working is mandatory.

Plan first. Then go one step at a time, and tell me what to test after
each step.
```

**Do this** before you leave the Session 6 lab: get the skeleton running and commit it. If it is not running, that is what office hours are for, and it is much cheaper to fix at Session 6 than at Session 10.

### Your first real feature, and analytics

*Session 7, on 10/7.*

The skeleton walks. Now give it one feature that a user would actually notice, chosen from the three in your PRD. One. The cut list exists so that you can answer "which one" without a meeting.

Work in the core loop from Part 3, and commit after each step that works.

Two things belong in this week and not later.

**Analytics, before you have users.** You put analytics on your landing pages back at Session 4, but that was a different project. This is your real product, and it needs its own. You cannot measure what you did not instrument, and there is no way to recover last week's usage data after the fact. Install it now, while the app is quiet and a mistake costs nothing.

**PROMPT**

```prompt
Add Vercel Analytics to this app. Then tell me how to see how many
people used it and which pages they visited.
```

**You'll know it worked when** you open your deployed URL, click around, and see your own visit appear on the Vercel Analytics dashboard within a few minutes.

**A deployed version that matches what you built.** From this week on, deploy at the end of every work session, not only when something is due. A product that only runs on your laptop cannot be user-tested, and user testing starts in two weeks.

---

## Part 11. Making it a real application

*Session 8, on 10/21.*

You have something that runs. Now you make it an application people could actually use.

### The course stack

Do not deviate without a reason you can explain.

| Piece | What it does |
|---|---|
| **Claude Code** | Your engineer |
| **Next.js** | The app framework. Claude chooses and manages it. |
| **Supabase** | Database and user accounts. Free tier. |
| **Vercel** | Hosting. Free tier. |
| **Stripe** | Only if you actually charge money during the course. Most teams should not. |

### The plain English map

When Claude uses these words, this is all they mean:

- **Frontend** is what users see. The dining room.
- **Backend** is the logic that does the work. The kitchen.
- **Database** is where things are stored. The pantry.
- **API** is how the pieces talk to each other. The waiter.

That analogy will get you through every architecture conversation in this course.

### What you never build yourself

Authentication, payments, and email. Three things that look simple and are not. Getting them wrong has real consequences, and solved versions are free.

- **Sign in** uses Supabase Auth, or "Sign in with Google."
- **Payments** use Stripe.
- **Email** uses a service, never code you wrote.

**PROMPT**

```prompt
Add sign-in to the app using Supabase Auth. Support email and Google.

Explain in plain English what happens to a password, where the session
is stored, and what a user sees if they are not signed in.
```

The general rule for build versus buy: if it is not the thing that makes your product different, buy it. Your competitive advantage is not your login page.

### Your data model

A data model is a plain English description of what you store and how the pieces relate.

**PROMPT**

```prompt
Here is what our app needs to store, in plain English:

[for example: "Users. Each user has projects. Each project has documents
and a status. Each document has an AI-generated summary."]

Design the database tables for this in Supabase. Explain each table and
each relationship in plain English before you build anything.

Then tell me: what happens if a user deletes a project? What happens to
its documents?
```

That last question catches a category of problem early. Most data model bugs are about what happens when something is removed.

### Calling an AI model from inside your app

Many products in this course call an AI model as part of what they do. Summarizing a document, drafting a reply, categorizing an entry.

**PROMPT**

```prompt
I want the app to [AI feature].

Add a call to the Claude API for this. Explain where to get an API key,
how to store it safely as an environment variable, and roughly what each
call costs.

Add a sensible fallback message for when the API fails or is slow.
```

Two things to watch.

**Cost.** This is a second, separate charge. Your Claude Pro subscription pays for Claude Code, which is you talking to Claude. An API key is your app talking to Claude, and it is billed on its own, by usage. For an MVP at classroom scale, expect a few dollars a month, not hundreds. Ask Claude to estimate before you launch. If the estimate is large, your prompt is probably sending far more text than it needs to. Set a spending limit on the API account the day you create it.

**Failure.** APIs go down and time out. If your app shows a spinner forever when that happens, your demo will be the time it happens. Always have a fallback message.

### Analytics

You installed analytics at Session 7, in Part 10. If you did not, go back and do it now, before you add anything else this week.

You cannot measure what you did not instrument. There is no way to recover last week's usage data after the fact. This is why it goes in early.

---

## Part 12. Design and usability

*Session 9, on 10/28.*

When everyone can build, execution quality becomes the visible difference. Users decide whether your product is credible in well under a second, and mostly on how it looks and how clearly it speaks.

You do not need to be a designer. You need enough judgment to recognize bad and enough vocabulary to ask for better.

### The five heuristics that matter for an MVP

Jakob Nielsen wrote ten usability heuristics. These five are the ones that will actually bite you.

1. **Visibility of system status.** The user should always know what is happening. If something takes two seconds, show that it is working.
2. **User control.** Let people undo things and go back. Nothing feels worse than an action you cannot reverse.
3. **Error prevention.** Stop the mistake before it happens rather than explaining it afterwards.
4. **Recognition over recall.** Show people their options. Do not make them remember what to type.
5. **Help users recover from errors.** An error message should say what happened and what to do next, in plain language.

### Three ideas from Don Norman worth knowing

From *The Design of Everyday Things*, which is the foundational book on why objects confuse people.

- **Affordance.** The visual suggestion of what something does. A button that looks pressable affords pressing. A word that looks like plain text does not, even if it is a link.
- **Feedback.** Every action needs a visible response. If a user clicks and nothing changes, they will click again, and now you have two of everything.
- **Mapping.** The relationship between a control and its effect should be obvious. Controls that are near what they affect are easier than controls in a distant menu.

### The empty state problem

Every product has a moment where a new user arrives and there is nothing there yet. No projects, no data, no history. Most student products show a blank screen at this moment, which reads as broken.

Design that screen deliberately. It should say what this is, what to do first, and ideally offer one button that does it.

**Time to first value** is the metric to think about here. How long from arriving to getting something useful? Every step you remove from that path is worth more than any feature you add.

### Words are design

Button labels, error messages, and empty states are the interface. AI is genuinely excellent at drafting these, and you are the editor.

**PROMPT**

```prompt
Rewrite every piece of text in this interface: buttons, error messages,
empty states, form labels, and confirmations.

Make each one clearer and friendlier. Use plain language. Show me
before and after side by side.
```

This is the cheapest quality upgrade available to you. It takes twenty minutes and it changes how the whole product feels.

### The AI design critique loop

1. Take screenshots of every screen of your app.
2. Paste them into Claude, in Claude Code or at claude.ai:

**PROMPT**

```prompt
Critique these screens against Nielsen's usability heuristics.

For each screen: what is confusing, what is missing (loading states,
empty states, error messages), and what violates visual hierarchy.

Also check accessibility basics: color contrast, font size, and whether
everything can be reached with a keyboard.

Then give me a prioritized top ten fix list, easiest first, phrased so
I can hand each item straight to Claude Code.
```

3. Hand the items to Claude Code one at a time. Not all ten at once.
4. Re-screenshot and run it again.

**Try this** for consistency: ask for a design system rather than styling things one at a time.

**PROMPT**

```prompt
Define a small design system for this app: a color palette, a spacing
scale, and three text sizes. Then apply it consistently everywhere.
```

Ad hoc styling is why student projects look like four different products stitched together.

---

## Part 13. Testing what you built

*Session 9, on 10/28. Required for the MVP demo.*

There are three separate things to test, and most teams only do the first one.

### 13.1 Does it break?

**PROMPT**

```prompt
Act as a hostile QA tester on this app. Systematically try to break it:

- Empty inputs, absurdly long inputs, emoji, negative numbers, and
  SQL-looking strings in every field
- Double-clicking submit buttons
- Using the browser back button in the middle of a flow
- A brand new user with no data. What do the empty screens look like?
- A mobile-width screen
- What happens if the AI or API call fails, or takes 30 seconds?

For each issue: severity (breaks it / embarrasses us / cosmetic), how to
reproduce it, and the fix.

Write to qa-report.md. Then fix all the "breaks it" items one at a time,
re-testing after each fix.
```

**Also do it by hand for fifteen minutes.** You will find things the agent did not, and it will find things you did not. Both go in the report. The QA report is a required part of your MVP demo submission.

### 13.2 Is your AI feature any good?

This is the part almost everyone skips, and it is the part this course cares most about.

If your product calls an AI model, that feature can run without errors and still produce output that is wrong, useless, or embarrassing. Your QA test above will not catch it, because nothing crashed.

**Do this:**

1. Write down ten realistic inputs your users would actually give it. Not clean test cases. Real, messy ones.
2. Run all ten through your feature.
3. Grade each output yourself: good, acceptable, or bad.
4. For every bad one, work out why.

**PROMPT**

```prompt
Here are ten real inputs to our [AI feature] and the outputs it produced:

[paste all ten pairs]

For each one, evaluate: is this output actually useful to our user?
Is anything in it factually wrong? Is the tone right?

Then identify patterns in the failures. What kind of input makes this
feature perform badly?

Suggest changes to the prompt we send, and tell me which failures a
prompt change will NOT fix.
```

That final clause matters. Some failures are prompt problems and some are "this is not something the model can do reliably." Knowing the difference is exactly the judgment this course is about. If your feature fails on a third of realistic inputs, the honest move is to narrow what it claims to do, not to keep tuning the prompt.

Put the result in your demo. A team that says "our summarizer works well on documents under two pages and degrades badly after that, so we cap it" is demonstrating more skill than a team that claims it always works.

### 13.3 Can a human use it?

**Do this: each team runs at least three moderated user tests with real humans before the MVP demo on 11/4.** The requirement is assigned at Session 8 on 10/21, so you have two weeks. Start early, because scheduling other people is the slow part. Send the messages before you have read this protocol, not after.

The protocol is simple and hard to follow:

1. Give them a task. "Sign up and create your first project."
2. Say nothing else. Nothing.
3. Watch where they stall, hesitate, or click the wrong thing.
4. Write down exactly what they said, especially when confused.

The hard part is the silence. Every instinct will tell you to help. Do not help. The moment you explain something is the moment you stop learning that it needed explaining.

Five users will surface about eighty five percent of your usability problems. Three is the minimum here because your timeline is short.

Their confusion outranks any AI opinion about your design.

---

## Part 14. Shipping to real users

*Session 9, on 10/28.*

This is the week your product stops being a class project and starts being something real people use. Two things change.

### 14.1 Getting your first users

You already know how to do this from the probe phase. The difference is that now the thing works.

- Go back to everyone who signed up on your landing page. They asked to hear from you. Email them.
- Return to the communities where you found interest, and share what you built.
- Go back to your interviewees. They told you about the problem. Show them the solution.

Start with ten people who will actually use it, not a hundred who will look once.

### 14.2 You are now responsible for other people's data

The moment a real person types real information into your app, you have taken on obligations. This is not a legal course and nobody expects you to draft a privacy policy. You are expected to have thought about four questions.

**What are you storing?** List it. Names, emails, whatever they type into your product. If you are sending their input to an AI API, that is also a thing you are doing with their data.

**Where does it live?** Your Supabase database, and possibly Anthropic's or another provider's servers if you call an API. Know which.

**Who can see it?** Check this rather than assuming. A common and serious mistake is a database configured so that any user can read every other user's rows.

**PROMPT**

```prompt
Review the database security rules for this app. Can any signed-in user
read or modify data belonging to another user? Show me exactly how the
rules prevent that, and test it.
```

**Did they agree to it?** If you are recording interviews, ask first. If you are storing user data, say so somewhere visible. If you are sending their input to a third-party AI service, that belongs in the same sentence.

A single honest paragraph on your site is enough for this course:

**PROMPT**

```prompt
Write a short, plain-language note for our site explaining what data we
collect, where it is stored, that we send [specific input] to an AI
service to provide [feature], and how someone can ask us to delete their
data. Keep it under 150 words and avoid legal jargon.
```

**Never** collect more than you need. The safest data is the data you did not store.

### 14.3 Triage before demo day

You will have more broken things than time. Prioritizing is the skill.

Sort every known issue on two axes: how bad it is, and how long it takes to fix.

1. **Breaks the core workflow.** Fix immediately, whatever it costs.
2. **Embarrassing but survivable, quick to fix.** Fix it.
3. **Embarrassing but survivable, slow to fix.** Leave it and mention it in the demo.
4. **Cosmetic.** Leave it. Nobody is grading your button corners.

Deliberately leaving something broken is a legitimate decision when you say so out loud. The MVP demo rubric rewards documented failures over hidden ones. A team that says "we know the export function times out on large files, here is why, here is what we would do" scores better than a team that hopes nobody clicks export.

Write your triage decisions in your build log. That is exactly the kind of judgment the log exists to capture.

---
---

# SECTION 4: SHOWING THE WORK

---

## Part 15. The demo

*Session 10, on 11/4. This session is the assessment.*

You get eight minutes. It is a live demo of the product, not a slide deck about the product.

### The checklist

- [ ] Rehearse the happy path five times, out loud, with a timer
- [ ] Record a backup screen capture with Loom or QuickTime, in case the live demo dies
- [ ] Set up a fresh test account with realistic data. No "asdf test 123" on screen
- [ ] Narrate value, not technology. "Watch how Maria gets this done in thirty seconds," never "we used Next.js"
- [ ] One slide maximum before the demo: the problem and who has it. The product is the presentation
- [ ] Show your evidence: one slide of interview quotes, signups, and user test findings, and what you changed because of them
- [ ] Report what you measured, and say plainly what you could not measure yet
- [ ] End with what you would build next and why, grounded in user evidence
- [ ] Assign question topics to teammates in advance

### Things that go wrong, and what to do

**The live demo breaks.** Switch to your backup recording and keep talking. You lose one point on the live criterion and nothing else. Panicking costs more than the bug.

**You run out of time.** This is the most common failure. It happens because teams show three features instead of one. Show the core workflow completely. Mention the rest in one sentence.

**Someone asks a question you cannot answer.** Say "I don't know, and here is how we would find out." That is a good answer. Bluffing is graded down, and experienced listeners can always tell.

### What the rubric actually rewards

The core workflow running end to end in front of people. Evidence visibly shaping the product, which means you can say "we changed X because user Y did Z." Honesty about limitations. Command of the questions afterwards.

Polish is not on that list. Polish is nearly free now, so it is not what distinguishes you.

---

## Part 16. The pitch

*Sessions 11 and 12, on 11/11 and 11/18. Pitch Day is 12/2.*

A demo shows the product works. A pitch argues the business works. They are different claims and they need different evidence.

What you are working toward:

| | Graduate | Undergraduate |
|---|---|---|
| Pitch length on 12/2 | 8 minutes, then 4 minutes of questions | 8 minutes, then 3 minutes of questions |
| Slides | 10 maximum | 8 maximum |

Two dates sit around Pitch Day. A near-final deck is due **11/29** for written feedback. It is ungraded, and it only helps if the deck is genuinely near final. The full Venture Package is due **12/11**, after you have pitched.

### 16.1 The narrative comes before the slides

Do not open your deck first. Write the story first.

The structure that works: name the change in the world, describe the stakes, show the promised land for your customer, then explain the thing you have that gets them there, and prove it.

AI ventures have an obvious change to name, which is exactly the problem. Every deck this year opens with "AI is transforming everything." Specificity is the only way out. Name the change in your industry, in the last eighteen months, with a date.

**PROMPT**

```prompt
Here is our pitch narrative: [paste].

Rewrite it in this arc:
1. Name the undeniable change in the world, specific to our market
2. Stakes: who wins and who loses because of it
3. The promised land for our customer
4. Our "magic": what we have that gets them there
5. Proof

Keep OUR evidence and numbers exactly as given. Do not invent or inflate
anything. Ninety seconds spoken, maximum.
```

### 16.2 Market sizing that survives scrutiny

Bottom up, always. Number of customers times price. Show the source for the customer count.

If you are selling work rather than software, size the labor spend instead of the software spend. That is usually a much bigger number and it is the honest comparison, because that is the budget you are attacking.

**Never** write "one percent of a fifty billion dollar market." Experienced listeners stop reading at that slide.

### 16.3 The five questions

Every investor asks AI startups the same five things. Prepare all five before Pitch Day.

1. What is your moat when the model improves?
2. Why doesn't OpenAI or the incumbent just do this?
3. What are your inference costs at scale, and what does that do to margins?
4. Is this a feature or a company?
5. What proprietary data or workflow lock-in accrues over time?

Your Session 6 answer to "what if Anthropic ships this next quarter" is the raw material for question one and two. It becomes a slide.

### 16.4 Deck critique

**PROMPT**

```prompt
You are a skeptical Series A investor who has seen 400 AI pitch decks
this year. Review my deck slide by slide [paste text or screenshots].

For each slide: what claim needs evidence, what a bored partner would
object to, and what to cut.

Be blunt. Then tell me the one slide that loses you, and why.
```

### 16.5 The murder board

**PROMPT**

```prompt
Generate the 20 hardest questions an investor would ask this venture.
Cover: moat when models improve, why the incumbent doesn't do this,
inference costs and margins, feature versus company, go to market, and
team credibility.

Then interview me. One question at a time. Interrupt vague answers.
Follow up twice before moving on.

Grade each answer from 1 to 5 at the end.
```

**Do this at least once before Pitch Day**, and log it. It is a requirement, not a suggestion. The murder board at Session 12 gives you two live rounds; this is the third, and it is the one you can run at midnight.

### The rule that does not change

AI polishes the story. The evidence must be real. Your deck is checked against your Discovery Report and your demo. Numbers that appear for the first time in the pitch will be asked about.

---
---

# SECTION 5: REFERENCE

---

## Part 17. Troubleshooting playbook

| What is happening | What to do |
|---|---|
| An error message, anywhere | Paste the entire error into Claude Code: "Explain this in plain English, then fix it." Never retype or shorten an error. |
| The fix did not work twice in a row | "Stop. Do not patch again. Diagnose the root cause from scratch, list three hypotheses, and test them one at a time." |
| It worked before and is broken now | "Show me recent commits and revert to the last working one." Then try the feature again in smaller steps. |
| Claude seems confused or is going in circles | Long sessions degrade. Type `/compact`, or start a fresh session. CLAUDE.md means it re-reads what matters. |
| Claude says it is done but it is not | "Walk me through how to verify this myself in the browser, step by step." Then actually do it. |
| You do not understand what it changed | "Explain what you just changed as if to a smart non-programmer, in five sentences." Never let unexplained changes pile up. |
| The app is slow or the AI call takes forever | "Show me what is slow here and why. What is the cheapest fix?" Often you are sending far more text to the API than you need to. |
| You have been stuck 45 minutes | Post in the class channel: your goal, the error, and what you tried. Helping each other debug earns participation credit. |

### The one that catches everyone

If you find yourself sending increasingly frustrated messages to an AI, stop. Close the terminal. Go do something else for twenty minutes.

The pattern where you send the same request eight times with more emphasis each time has never worked for anyone. When two attempts have failed, the approach is wrong. Change the approach.

---

## Part 18. Glossary

**Agent** An AI model that can take actions in a loop, checking results and trying again. Claude Code is one.

**API** How one piece of software talks to another.

**API key** A password for an API. Treat it like a password, because it is one.

**Backend** The logic that does the work. The kitchen.

**Commit** A save point in your project's history, stored on your own machine until you push it.

**Context window** The AI's short-term memory. It is why long sessions get worse and why `/compact` helps.

**Database** Where information is stored between visits. The pantry.

**Deploy** To put your app on the internet so other people can open it.

**Environment variable** The safe place to keep API keys, outside your code.

**Frontend** What users see and click. The dining room.

**Git** The save-point system that runs on your own laptop. Keeps the history, lets you go back.

**GitHub** The website that holds a copy of that history. Where your repo link comes from. Not the same thing as git.

**Hallucination** When AI confidently makes something up. The reason for every verification rule in this handbook.

**LLM** Large language model. The AI itself.

**localhost** Your app running only on your own machine. Nobody else can see it.

**MVP** Minimum viable product. The smallest thing that tests whether your idea is right.

**PRD** The one page describing what you are building, before you build it.

**Probe** A deliberately disposable thing built to collect evidence, not to be a product.

**Prompt** What you tell the AI.

**Push** Sending your commits from your laptop up to GitHub. Committing is not pushing.

**Repo** Short for repository. Your project folder stored on GitHub. When an assignment asks for a repo link, it wants the GitHub web address.

**Slash command** An instruction to Claude Code itself rather than a request to build something. `/init` and `/compact` are the two you need.

**Version control** The general name for what git does: keeping a history you can move around in.

**Walking skeleton** The thinnest end-to-end version of your product where the core action works, badly.

Anything not on this list, ask Claude. "Explain [term] to someone who has never written code" works every time.

---

## A final word

The students who do best in this course are not the ones who write the cleverest prompts in week two. They are the ones who verify, commit, and take one small step at a time.

Every tool named in this handbook will change. Some of them will be gone within a year. The discipline underneath will not: describe clearly, plan before building, check with your own eyes, save your work, and be honest about what did not work.

That is the whole thing.
