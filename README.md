# CS:GO Case Opening Simulator

A CS:GO case opening simulator available in three versions — a Java terminal app,
a web app, and a Discord bot. Open crates, roll rarities, and see what skin you
get, all based on real CS:GO drop rates.

---

## Play Now

| Version      | Link                                                                 |
|--------------|----------------------------------------------------------------------|
| 🌐 Web App   | [tenzukun.github.io/CSGO-Case-Simulator](https://tenzukun.github.io/CSGO-Case-Simulator/) |
| 🤖 Discord Bot | Invite link — add it to your server and use `/open`               |
| 💻 Terminal  | Clone the repo and run locally (see instructions below)              |

---

## Features

### All versions
- Real CS:GO drop rates for rarity, exterior, and prefix
- Full item details — name, type, rarity tier, exterior, float, seed, price
- Float bar with zone labels (FN / MW / FT / WW / BS)
- Estimated market price adjusted by wear and prefix
- StatTrak™ kill counter when applicable
- Persistent inventory across sessions

### Web version only
- Open 1x, 5x, or 10x at once
- Quick Open toggle to skip the rolling animation
- Multi-result grid highlighting the best item from a batch
- Inventory and session stats panels
- Fully mobile responsive

### Discord bot only
- `/open` — open a crate and get a full embed card
- `/inventory` — view your rolled items
- `/stats` — view your overall breakdown
- `/reset` — clear your inventory

### Terminal version only
- Animated dot-by-dot rolling effect
- Play again loop
- Session summary on exit

---

## How to Run (Java Terminal Version)

### Step 1 — Check if Java is installed

Open a terminal and run:

    java -version

If you see a version number printed, Java is already installed — skip to Step 3.
If you get an error like "command not found", continue to Step 2.

---

### Step 2 — Install the Java JDK

**Windows:**
1. Go to [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)
2. Download the latest **JDK** installer for Windows (`.exe`)
3. Run the installer and follow the prompts — default settings are fine
4. Close and reopen your terminal, then run `java -version` to confirm it worked

**Mac:**
1. Option A — Download from Oracle same as above, but pick the macOS `.dmg` installer
2. Option B — If you have Homebrew installed, run:

       brew install openjdk

3. Confirm with `java -version`

**Linux:**

    sudo apt update
    sudo apt install default-jdk

Then confirm with `java -version`.

---

### Step 3 — Get the files

**Option A — Clone with Git (recommended):**

    git clone https://github.com/Tenzukun/CSGO-Case-Simulator.git

**Option B — Download manually:**
1. Click the green **Code** button at the top of this repo
2. Click **Download ZIP**
3. Extract the ZIP somewhere on your computer

---

### Step 4 — Open and run the file

#### Option A — Using VS Code (recommended)

VS Code is a free code editor that makes it easy to manage files and run
terminal commands in one place.

**If you don't have VS Code:**
1. Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Click **Download for Windows/Mac/Linux** depending on your OS
3. Run the installer — default settings are fine
4. Open VS Code once installation is complete

**Once VS Code is installed:**
1. Go to **File → Open Folder**
2. Navigate to and select the `CSGO-Case-Simulator` folder
3. Open the built-in terminal with **Ctrl + `** (backtick, the key above Tab).
   On Mac use **Cmd + `**
4. Navigate to the terminal folder:

       cd terminal

5. Compile and run:

       javac CrateOpening.java
       java CrateOpening

---

#### Option B — Using your system terminal (no VS Code needed)

**Windows — Command Prompt or PowerShell:**
1. Press **Win + R**, type `cmd`, and hit Enter
2. Navigate to the terminal folder:

       cd C:\Users\YourName\Downloads\CSGO-Case-Simulator\terminal

3. Compile and run:

       javac CrateOpening.java
       java CrateOpening

**Mac — Terminal:**
1. Press **Cmd + Space**, type `Terminal`, and hit Enter
2. Navigate to the terminal folder:

       cd ~/Downloads/CSGO-Case-Simulator/terminal

3. Compile and run:

       javac CrateOpening.java
       java CrateOpening

**Linux — Terminal:**
1. Open your terminal (usually Ctrl + Alt + T)
2. Navigate to the terminal folder:

       cd ~/Downloads/CSGO-Case-Simulator/terminal

3. Compile and run:

       javac CrateOpening.java
       java CrateOpening

---

> **Not sure where your folder is?**
> On Windows, right-click the folder in File Explorer and select **Copy as path**.
> On Mac, right-click the folder, hold Option, and select **Copy as Pathname**.
> Then paste it after `cd ` in your terminal.

---

### Troubleshooting

**"javac is not recognized"** — Java was installed but not added to PATH.
On Windows, search for "Edit the system environment variables", open it,
go to Environment Variables, find `Path` under System Variables, click Edit,
and add the path to your JDK's `bin` folder (e.g. `C:\Program Files\Java\jdk-21\bin`).
Then restart your terminal.

**"CrateOpening.java not found"** — You're in the wrong folder.
Make sure your terminal is inside the `terminal` subfolder, not the root of the repo.
Run `ls` (Mac/Linux) or `dir` (Windows) to see what files are in your current location.

---

## Terminal Commands

After each roll you will see this prompt:

    ENTER to roll again  |  'inv' for inventory  |  'reset' to clear inventory  |  'quit' to exit

| Input   | Action                                    |
|---------|-------------------------------------------|
| ENTER   | Open another crate                        |
| inv     | View your full inventory                  |
| reset   | Clear your inventory                      |
| quit    | Exit and show your session summary        |

---

## Drop Rates

### Rarity
Based on real CS:GO case odds:

| Rarity         | Colour | Chance |
|----------------|--------|--------|
| Rare Special   | GOLD   | 0.26%  |
| Covert         | Red    | 0.64%  |
| Classified     | Pink   | 3.20%  |
| Restricted     | Purple | 15.98% |
| Mil-Spec Grade | Blue   | 79.92% |

### Exterior
Based on CS:GO's float value distribution:

| Exterior       | Float Range   | Chance |
|----------------|---------------|--------|
| Factory New    | 0.000 – 0.070 | 3%     |
| Minimal Wear   | 0.070 – 0.150 | 15%    |
| Field-Tested   | 0.150 – 0.380 | 40%    |
| Well-Worn      | 0.380 – 0.450 | 18%    |
| Battle-Scarred | 0.450 – 1.000 | 24%    |

### Prefix

| Prefix    | Chance |
|-----------|--------|
| StatTrak™ | 10%    |
| Souvenir  | 2%     |
| None      | 88%    |

---

## Skin Pool

### GOLD — Rare Special Items
- ★ Karambit | Doppler
- ★ Butterfly Knife | Fade
- ★ M9 Bayonet | Marble Fade
- ★ Sport Gloves | Pandora's Box

### Red — Covert
- AWP | Dragon Lore
- AK-47 | Wild Lotus
- M4A4 | Howl
- Desert Eagle | Blaze

### Pink — Classified
- AK-47 | Vulcan
- USP-S | Kill Confirmed
- AWP | Hyper Beast
- M4A1-S | Hyper Beast

### Purple — Restricted
- AK-47 | Redline
- AWP | Asiimov
- Glock-18 | Water Elemental
- P90 | Asiimov

### Blue — Mil-Spec
- MP9 | Hot Rod
- P250 | Sand Dune
- Nova | Predator
- MAG-7 | Sonar

---

## Project Structure

    CSGO-Case-Simulator/
    ├── terminal/
    │   └── CrateOpening.java        <- Java terminal version
    ├── discord-bot/
    │   ├── index.js                 <- main bot file
    │   ├── rolls.js                 <- CS:GO roll logic
    │   ├── storage.js               <- inventory storage
    │   ├── deploy-commands.js       <- slash command registration
    │   └── package.json
    ├── docs/
    │   ├── index.html               <- web version
    │   ├── style.css
    │   └── script.js
    ├── .gitignore
    └── README.md

---

## Built With
- Java (terminal version)
- HTML / CSS / JavaScript (web version)
- Discord.js (Discord bot)
- Railway (Discord bot hosting)
- GitHub Pages (web hosting)
- VS Code