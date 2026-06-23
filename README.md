# CS:GO Case Opening Simulator

A CS:GO case opening simulator available in three versions: a Java terminal app, a web app, and a Discord bot. Open crates, roll rarities, and see what skin you get, all based on real CS:GO drop rates.

**Update:** Added weekly rewards system, cross-device data sync, favourite skins, all-time stats, economy rebalancing, level details panel, and various quality-of-life fixes.

---

## Play Now

| Version      | Link |
|--------------|------|
| Web App      | [tenzukun.github.io/CSGO-Case-Simulator](https://tenzukun.github.io/CSGO-Case-Simulator/) |
| Discord Bot  | [Invite to your server](https://discord.com/oauth2/authorize?client_id=1518623546513952818&permissions=2147502080&integration_type=0&scope=bot+applications.commands) |

---

## Features

### Web version
- Real CS:GO drop rates for rarity, exterior, and prefix
- Full item details: name, rarity, exterior, float, seed, price
- Float bar with zone labels (FN / MW / FT / WW / BS)
- Estimated market price adjusted by wear and prefix
- StatTrak kill counter when applicable
- Open 1x, 5x, or 10x at once with Quick Open toggle
- Multi-result grid highlighting the best item from a batch
- 8 cases with level-gated progression (Starter through Classified)
- Weekly reward system with 7 day-by-day claims including mid-week and end-of-week case rewards
- Cross-device data sync: enter the same username on any device to load your progress
- Favourite skins so Sell All never removes starred items
- All-time persistent stats panel
- Fishing minigame with tiered catch outcomes and level-scaled payouts
- Level and XP system with level-up popup and perks
- Level Details panel showing every milestone and its perks
- 35 achievements with badge grid and auto-dismissing popup notifications
- Shared leaderboard via Firebase Realtime Database (Total Earned, Cases, Best Item, Level)
- Fully mobile responsive

### Discord bot
- `/open` — open a crate and get a full embed card
- `/inventory` — view your rolled items
- `/stats` — view your overall breakdown
- `/reset` — clear your inventory
- `/support` — link to the Ko-fi page

### Java terminal version
- Animated dot-by-dot rolling effect
- Persistent inventory saved to file
- Play again loop with session summary on exit

---

## Drop Rates

### Rarity

| Rarity         | Chance  |
|----------------|---------|
| Gold           | 0.26%   |
| Red (Covert)   | 0.64%   |
| Pink           | 3.20%   |
| Purple         | 15.98%  |
| Blue           | 79.92%  |

### Exterior

| Exterior       | Float Range   | Chance |
|----------------|---------------|--------|
| Factory New    | 0.000 – 0.070 | 3%     |
| Minimal Wear   | 0.070 – 0.150 | 15%    |
| Field-Tested   | 0.150 – 0.380 | 40%    |
| Well-Worn      | 0.380 – 0.450 | 18%    |
| Battle-Scarred | 0.450 – 1.000 | 24%    |

---

## Case Unlock Levels

| Case            | Level Required | Cost          |
|-----------------|----------------|---------------|
| Starter Case    | 1              | 200 coins     |
| Chroma Case     | 1              | 500 coins     |
| Clutch Case     | 1              | 1,000 coins   |
| Dragon Case     | 1              | 2,500 coins   |
| Spectrum Case   | 5              | 5,000 coins   |
| Prisma Case     | 15             | 15,000 coins  |
| Glove Case      | 25             | 35,000 coins  |
| Classified Case | 40             | 75,000 coins  |

---

## Project Structure

```
CSGO-Case-Simulator/
├── docs/                   <- Web app (GitHub Pages)
│   ├── index.html
│   ├── base.css
│   ├── cases.css
│   ├── inventory.css
│   ├── fishing.css
│   ├── leaderboard.css
│   ├── progression.css
│   ├── achievements.css
│   ├── weekly.css
│   ├── mobile.css
│   ├── data.js
│   ├── rolls.js
│   ├── progression.js
│   ├── leaderboard.js
│   ├── fishing.js
│   ├── achievements.js
│   ├── weekly.js
│   └── script.js
├── discord-bot/
│   ├── index.js
│   ├── rolls.js
│   ├── storage.js
│   ├── deploy-commands.js
│   └── package.json
├── terminal/
│   └── CrateOpening.java
├── .gitignore
└── README.md
```

---

## How to Run (Java Terminal)

### Step 1 — Check Java

```
java -version
```

If not installed, download the JDK from [oracle.com/java/technologies/downloads](https://www.oracle.com/java/technologies/downloads/).

### Step 2 — Clone or download the repo

```
git clone https://github.com/Tenzukun/CSGO-Case-Simulator.git
```

### Step 3 — Run

```
cd terminal
javac CrateOpening.java
java CrateOpening
```

---

## Support

If you enjoy the project, consider buying me a coffee!

[ko-fi.com/nthn_mp4](https://ko-fi.com/nthn_mp4)