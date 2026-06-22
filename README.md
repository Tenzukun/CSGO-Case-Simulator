# CS:GO Crate Opening Simulator

A terminal-based CS:GO case opening simulator written in Java.
Open crates, roll rarities, and see what skin you get — all based on
real CS:GO drop rates. Your inventory persists between sessions so you
can keep track of everything you've ever unboxed.

A web version is also available — open `web/index.html` in any browser
or visit the GitHub Pages link at the top of this repo.

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

    git clone https://github.com/YOURUSERNAME/CSGOSim.git

**Option B — Download manually:**
1. Click the green **Code** button at the top of this repo
2. Click **Download ZIP**
3. Extract the ZIP somewhere on your computer

---

### Step 4 — Open in VS Code

1. Open VS Code
2. Go to **File → Open Folder** and select the `CSGOSim` folder
3. Open the terminal inside VS Code with **Ctrl + `** (backtick, top-left of keyboard)

---

### Step 5 — Navigate to the Java folder

In the VS Code terminal, navigate to the right folder.

**Windows example:**

    cd C:\Users\YourName\Documents\CSGOSim\java

**Mac/Linux example:**

    cd ~/Documents/CSGOSim/java

If you're not sure where the folder is, right-click it in VS Code's file explorer
and select **Copy Path**, then paste it after `cd `.

---

### Step 6 — Compile and run

    javac CrateOpening.java
    java CrateOpening

The program will launch immediately. Press ENTER when prompted to open your first crate.

---

### Troubleshooting

**"javac is not recognized"** — Java was installed but not added to PATH.
On Windows, search for "Edit the system environment variables", open it,
go to Environment Variables, find `Path` under System Variables, click Edit,
and add the path to your JDK's `bin` folder (e.g. `C:\Program Files\Java\jdk-21\bin`).
Then restart your terminal.

**"CrateOpening.java not found"** — You're in the wrong folder.
Make sure your terminal is inside the `java` subfolder, not the root of the repo.
Run `ls` (Mac/Linux) or `dir` (Windows) to see what files are in your current location.

---

## Features

- Animated `Rolling...` effect that builds up dot by dot
- Real CS:GO drop rates for rarity, exterior, and prefix
- Full item card displayed after every roll
- Float bar with zone labels (FN / MW / FT / WW / BS) and a marker pinned to your exact float
- Estimated market price per item adjusted by wear and prefix
- Randomly generated seed per item
- Unique reaction message per rarity tier
- Play again loop — keep opening crates until you type `quit`
- Persistent inventory saved to `inventory.txt` — carries over between sessions
- View your inventory at any time by typing `inv`
- Reset your inventory at any time by typing `reset`
- Session summary on exit showing all your rolls and your best item

---

## How It Works

Each crate opening rolls five things independently:

| Roll     | What it decides                                   |
|----------|---------------------------------------------------|
| Rarity   | The colour tier of the item                       |
| Skin     | The specific weapon and finish                    |
| Exterior | The wear condition of the skin                    |
| Float    | The exact float value within the exterior's range |
| Prefix   | Whether it's StatTrak™, Souvenir, or neither      |

The final item card looks like this:

    =======================================
      StatTrak™ AK-47 | Redline
      Restricted · Field-Tested
      Type   : Rifle
    ---------------------------------------
      Price  : ~$15.00
    ---------------------------------------
       FN  MW     FT     WW            BS
      [===|===|=========|===|======================]
                  ^
      Float: 0.2341   Seed: 264
      StatTrak: 42,711 Confirmed Kills
    =======================================

---

## Commands

After each roll you will see this prompt:

    ENTER to roll again  |  'inv' for inventory  |  'reset' to clear inventory  |  'quit' to exit

| Input   | Action                                    |
|---------|-------------------------------------------|
| ENTER   | Open another crate                        |
| inv     | View your full inventory                  |
| reset   | Clear your inventory (deletes the file)   |
| quit    | Exit and show your session summary        |

You can chain `inv` and `reset` as many times as you want before rolling again.

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

## Inventory

Every item you roll is automatically saved to `inventory.txt` in the same folder.
Type `inv` after any roll to view it:

    =======================================
          Your Inventory (3 items)
    =======================================
      #1   StatTrak™ AK-47 | Redline (Field-Tested)
           Restricted (Purple) · Rifle
           Float: 0.2341  Seed: 264  Price: ~$15.00
      ---------------------------------------
      #2   AWP | Hyper Beast (Factory New)
           Classified (Pink) · Rifle
           Float: 0.0312  Seed: 847  Price: ~$90.00
      ---------------------------------------
      #3   P250 | Sand Dune (Battle-Scarred)
           Mil-Spec Grade (Blue) · Pistol
           Float: 0.7823  Seed: 102  Price: ~$0.25
    =======================================

Type `reset` to wipe the inventory and start fresh.

---

## Session Summary

When you type `quit` the program shows a full breakdown of the current session:

    =======================================
               Session Summary             
    =======================================
      Crates Opened : 12
    ---------------------------------------
      GOLD          : 0
      Rare (Red)    : 1
      Pink          : 1
      Purple        : 3
      Blue          : 7
    ---------------------------------------
      Best Roll     : AWP | Dragon Lore (Minimal Wear)
      Best Rarity   : Rare (Red)
    =======================================

    Thanks for playing! Good luck on your next case.
    =======================================

---

## Project Structure

    CSGOSim/
    ├── java/
    │   ├── CrateOpening.java
    │   └── inventory.txt         <- auto-created on first roll
    ├── web/
    │   └── index.html            <- open in any browser, no install needed
    ├── .gitignore
    └── README.md

### Methods at a glance (Java version)

| Method                | Purpose                                         |
|-----------------------|-------------------------------------------------|
| `main()`              | Controls flow, loop, and session tracking       |
| `printRolling()`      | Animated dot-by-dot rolling effect              |
| `rollRarity()`        | Rolls the colour tier using real CS:GO odds     |
| `rollSkin()`          | Picks a random skin from the matching pool      |
| `rollWear()`          | Rolls the exterior condition                    |
| `rollFloat()`         | Generates a float within the exterior's range   |
| `rollPrefix()`        | Rolls StatTrak™, Souvenir, or nothing           |
| `getSkinPrice()`      | Estimates market price adjusted by wear/prefix  |
| `getWeaponType()`     | Maps the skin name to a weapon category         |
| `getRarityTierName()` | Maps rarity to its CS:GO tier label             |
| `getRarityRank()`     | Scores rarity 1–5 for best item tracking        |
| `getRarityMessage()`  | Returns a unique reaction per rarity tier       |
| `printFloatBar()`     | Draws the float bar with zone labels and marker |
| `floatToBarPos()`     | Maps a float value to its bar character offset  |
| `saveToInventory()`   | Appends a rolled item to inventory.txt          |
| `loadInventory()`     | Reads inventory.txt into a list                 |
| `printInventory()`    | Displays the full inventory                     |
| `resetInventory()`    | Deletes inventory.txt                           |
| `printSessionStats()` | Displays the session summary on quit            |
| `printBanner()`       | Prints the header on startup                    |

---

## Built With
- Java (terminal version)
- HTML / CSS / JavaScript (web version)
- VS Code