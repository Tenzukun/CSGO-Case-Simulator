import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;

public class CrateOpening {

    private static final Random random         = new Random();
    private static final String INVENTORY_FILE = "inventory.txt";

    public static void main(String[] args) throws InterruptedException {

        printBanner();

        System.out.println("Welcome to CS:GO Crate Opening!");
        System.out.println("Think you can hit the gold? Give it a shot.");
        System.out.println();

        Scanner scanner = new Scanner(System.in);
        String input = "";

        // --- Session stats ---
        int totalOpened    = 0;
        int blueCount      = 0;
        int purpleCount    = 0;
        int pinkCount      = 0;
        int redCount       = 0;
        int goldCount      = 0;
        String bestItem       = "None";
        String bestRarity     = "None";
        int    bestRarityRank = 0;

        System.out.println("Press ENTER to open your first crate...");
        scanner.nextLine();

        do {
            printRolling();

            String rarity   = rollRarity();
            String skin     = rollSkin(rarity);
            String wear     = rollWear();
            String prefix   = rollPrefix();
            double floatVal = rollFloat(wear);
            double price    = getSkinPrice(skin, wear, prefix);
            String type     = getWeaponType(skin);
            String tier     = getRarityTierName(rarity);
            int    seed     = random.nextInt(1000) + 1;

            String fullName;
            if (prefix.isEmpty()) {
                fullName = skin;
            } else {
                fullName = prefix + " " + skin;
            }

            String fullItem = fullName + " (" + wear + ")";

            // --- Update session stats ---
            totalOpened++;

            switch (rarity) {
                case "GOLD":       goldCount++;   break;
                case "Rare (Red)": redCount++;    break;
                case "Pink":       pinkCount++;   break;
                case "Purple":     purpleCount++; break;
                default:           blueCount++;   break;
            }

            int rank = getRarityRank(rarity);
            if (rank > bestRarityRank) {
                bestRarityRank = rank;
                bestRarity     = rarity;
                bestItem       = fullItem;
            }

            // --- Save to inventory ---
            saveToInventory(fullItem, tier, rarity, type, floatVal, seed, price);

            // --- Output ---
            System.out.println();
            System.out.println(getRarityMessage(rarity));
            System.out.println();

            String divider = rarity.equals("GOLD")
                ? "***************************************"
                : "=======================================";

            System.out.println(divider);
            System.out.println("  " + fullName);
            System.out.println("  " + tier + " \u00b7 " + wear);
            System.out.println("  Type   : " + type);
            System.out.println("---------------------------------------");
            System.out.printf ("  Price  : ~$%,.2f%n", price);
            System.out.println("---------------------------------------");
            printFloatBar(floatVal);
            System.out.printf ("  Float: %.4f   Seed: %d%n", floatVal, seed);

            if (prefix.equals("StatTrak\u2122")) {
                int kills = random.nextInt(100000);
                System.out.printf("  StatTrak: %,d Confirmed Kills%n", kills);
            }

            System.out.println(divider);
            System.out.println();

            // --- Menu loop ---
            boolean menuDone = false;
            while (!menuDone) {
                System.out.println("ENTER to roll again  |  'inv' for inventory  |  'reset' to clear inventory  |  'quit' to exit");
                input = scanner.nextLine().trim();
                System.out.println();

                if (input.equalsIgnoreCase("inv")) {
                    printInventory();
                } else if (input.equalsIgnoreCase("reset")) {
                    resetInventory();
                } else {
                    menuDone = true;
                }
            }

        } while (!input.equalsIgnoreCase("quit"));

        printSessionStats(totalOpened, blueCount, purpleCount, pinkCount, redCount, goldCount, bestItem, bestRarity);

        System.out.println("Thanks for playing! Good luck on your next case.");
        System.out.println("=======================================");

        scanner.close();
    }

    // -------------------------------------------------------
    // Inventory methods
    // -------------------------------------------------------

    private static void saveToInventory(String fullItem, String tier, String rarity,
                                        String type, double floatVal, int seed, double price) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(INVENTORY_FILE, true))) {
            writer.write(fullItem + ";;" + tier + ";;" + rarity + ";;" + type
                       + ";;" + String.format("%.4f", floatVal)
                       + ";;" + seed
                       + ";;" + String.format("%.2f", price));
            writer.newLine();
        } catch (IOException e) {
            System.out.println("  [Warning: Could not save to inventory.]");
        }
    }

    private static List<String[]> loadInventory() {
        List<String[]> items = new ArrayList<>();
        File file = new File(INVENTORY_FILE);
        if (!file.exists()) return items;

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    items.add(line.split(";;"));
                }
            }
        } catch (IOException e) {
            System.out.println("  [Warning: Could not read inventory.]");
        }

        return items;
    }

    private static void printInventory() {
        List<String[]> items = loadInventory();

        System.out.println("=======================================");
        System.out.printf ("      Your Inventory (%d items)%n", items.size());
        System.out.println("=======================================");

        if (items.isEmpty()) {
            System.out.println("  No items yet. Start rolling!");
        } else {
            for (int i = 0; i < items.size(); i++) {
                String[] p = items.get(i);
                // p[0]=fullItem  p[1]=tier  p[2]=rarity  p[3]=type
                // p[4]=float     p[5]=seed  p[6]=price
                System.out.printf("  #%-3d %s%n", (i + 1), p[0]);
                if (p.length >= 7) {
                    System.out.printf("       %s (%s) · %s%n", p[1], p[2], p[3]);
                    System.out.printf("       Float: %s  Seed: %s  Price: ~$%s%n", p[4], p[5], p[6]);
                }
                if (i < items.size() - 1) {
                    System.out.println("  ---------------------------------------");
                }
            }
        }

        System.out.println("=======================================");
        System.out.println();
    }

    private static void resetInventory() {
        File file = new File(INVENTORY_FILE);
        if (file.exists()) {
            file.delete();
            System.out.println("  Inventory cleared.");
        } else {
            System.out.println("  Inventory is already empty.");
        }
        System.out.println();
    }

    // -------------------------------------------------------
    // Rolling methods
    // -------------------------------------------------------

    private static void printRolling() throws InterruptedException {
        System.out.print("Rolling");
        for (int i = 0; i < 6; i++) {
            Thread.sleep(200);
            System.out.print(".");
            if (i == 2) Thread.sleep(150);
        }
        System.out.println();
    }

    // Rolls a colour tier based on real CS:GO case odds
    private static String rollRarity() {
        double roll = random.nextDouble() * 100;

        if (roll < 0.26)       return "GOLD";
        else if (roll < 0.90)  return "Rare (Red)";
        else if (roll < 4.10)  return "Pink";
        else if (roll < 20.08) return "Purple";
        else                   return "Blue";
    }

    // Returns a random skin from the pool matching the rolled colour tier
    private static String rollSkin(String rarity) {
        String[] pool;

        switch (rarity) {
            case "GOLD":
                pool = new String[] {
                    "\u2605 Karambit | Doppler",
                    "\u2605 Butterfly Knife | Fade",
                    "\u2605 M9 Bayonet | Marble Fade",
                    "\u2605 Sport Gloves | Pandora's Box"
                };
                break;
            case "Rare (Red)":
                pool = new String[] {
                    "AWP | Dragon Lore",
                    "AK-47 | Wild Lotus",
                    "M4A4 | Howl",
                    "Desert Eagle | Blaze"
                };
                break;
            case "Pink":
                pool = new String[] {
                    "AK-47 | Vulcan",
                    "USP-S | Kill Confirmed",
                    "AWP | Hyper Beast",
                    "M4A1-S | Hyper Beast"
                };
                break;
            case "Purple":
                pool = new String[] {
                    "AK-47 | Redline",
                    "AWP | Asiimov",
                    "Glock-18 | Water Elemental",
                    "P90 | Asiimov"
                };
                break;
            default:
                pool = new String[] {
                    "MP9 | Hot Rod",
                    "P250 | Sand Dune",
                    "Nova | Predator",
                    "MAG-7 | Sonar"
                };
                break;
        }

        return pool[random.nextInt(pool.length)];
    }

    // Rolls a wear exterior based on CS:GO float distribution
    private static String rollWear() {
        double roll = random.nextDouble() * 100;

        if (roll < 3)       return "Factory New";
        else if (roll < 18) return "Minimal Wear";
        else if (roll < 58) return "Field-Tested";
        else if (roll < 76) return "Well-Worn";
        else                return "Battle-Scarred";
    }

    // Rolls a special prefix — StatTrak, Souvenir, or nothing
    private static String rollPrefix() {
        double roll = random.nextDouble() * 100;

        if (roll < 10)      return "StatTrak\u2122";
        else if (roll < 12) return "Souvenir";
        else                return "";
    }

    // Generates a float value within the correct range for the exterior
    private static double rollFloat(String wear) {
        double min, max;

        switch (wear) {
            case "Factory New":  min = 0.000; max = 0.070; break;
            case "Minimal Wear": min = 0.070; max = 0.150; break;
            case "Field-Tested": min = 0.150; max = 0.380; break;
            case "Well-Worn":    min = 0.380; max = 0.450; break;
            default:             min = 0.450; max = 1.000; break;
        }

        return min + (random.nextDouble() * (max - min));
    }

    // -------------------------------------------------------
    // Display methods
    // -------------------------------------------------------

    private static void printFloatBar(double floatVal) {
        // Zone label line — centred to bar zones below
        System.out.println("   FN  MW     FT     WW            BS");
        // Bar with separators at zone boundaries
        System.out.println("  [===|===|=========|===|======================]");

        // ^ marker pinned to the exact float position
        int barPos = floatToBarPos(floatVal);
        int col    = 3 + barPos;
        StringBuilder marker = new StringBuilder();
        for (int i = 0; i < col; i++) marker.append(" ");
        marker.append("^");
        System.out.println(marker.toString());
    }

    // Maps a float value to its character position inside the bar
    private static int floatToBarPos(double floatVal) {
        floatVal = Math.max(0.0, Math.min(1.0, floatVal));

        if (floatVal <= 0.07) {
            return Math.min((int)(floatVal / 0.07 * 3), 2);
        } else if (floatVal <= 0.15) {
            return 4  + Math.min((int)((floatVal - 0.07) / 0.08 * 3),  2);
        } else if (floatVal <= 0.38) {
            return 8  + Math.min((int)((floatVal - 0.15) / 0.23 * 9),  8);
        } else if (floatVal <= 0.45) {
            return 18 + Math.min((int)((floatVal - 0.38) / 0.07 * 3),  2);
        } else {
            return 22 + Math.min((int)((floatVal - 0.45) / 0.55 * 22), 21);
        }
    }

    private static void printSessionStats(int total, int blue, int purple, int pink,
                                          int red, int gold, String bestItem, String bestRarity) {
        System.out.println("=======================================");
        System.out.println("           Session Summary             ");
        System.out.println("=======================================");
        System.out.printf ("  Crates Opened : %d%n", total);
        System.out.println("---------------------------------------");
        System.out.printf ("  GOLD          : %d%n", gold);
        System.out.printf ("  Rare (Red)    : %d%n", red);
        System.out.printf ("  Pink          : %d%n", pink);
        System.out.printf ("  Purple        : %d%n", purple);
        System.out.printf ("  Blue          : %d%n", blue);
        System.out.println("---------------------------------------");
        System.out.println("  Best Roll     : " + bestItem);
        System.out.println("  Best Rarity   : " + bestRarity);
        System.out.println("=======================================");
        System.out.println();
    }

    private static void printBanner() {
        System.out.println("=======================================");
        System.out.println("          CS:GO Crate Opening          ");
        System.out.println("=======================================");
        System.out.println();
    }

    // -------------------------------------------------------
    // Helper methods
    // -------------------------------------------------------

    private static int getRarityRank(String rarity) {
        switch (rarity) {
            case "GOLD":       return 5;
            case "Rare (Red)": return 4;
            case "Pink":       return 3;
            case "Purple":     return 2;
            default:           return 1;
        }
    }

    private static String getWeaponType(String skin) {
        String weapon = skin.replace("\u2605 ", "");
        if (weapon.contains(" | ")) {
            weapon = weapon.split(" \\| ")[0].trim();
        }

        switch (weapon) {
            case "AK-47": case "M4A4": case "M4A1-S": case "AWP":
            case "SG 553": case "AUG": case "FAMAS": case "Galil AR":
            case "G3SG1":  case "SCAR-20":
                return "Rifle";
            case "Desert Eagle": case "USP-S":  case "Glock-18": case "P250":
            case "P2000":        case "Tec-9":  case "Five-SeveN":
            case "CZ75-Auto":    case "R8 Revolver":
                return "Pistol";
            case "MP9": case "MP7": case "MP5-SD": case "P90":
            case "PP-Bizon": case "MAC-10": case "UMP-45":
                return "SMG";
            case "Nova": case "MAG-7": case "Sawed-Off": case "XM1014":
                return "Shotgun";
            case "M249": case "Negev":
                return "Machine Gun";
            case "Karambit":       case "Butterfly Knife": case "M9 Bayonet":
            case "Flip Knife":     case "Gut Knife":       case "Huntsman Knife":
            case "Falchion Knife":
                return "Knife";
            case "Sport Gloves":  case "Specialist Gloves":
            case "Moto Gloves":   case "Hand Wraps":
                return "Gloves";
            default:
                return "Unknown";
        }
    }

    // Maps rarity to its official CS:GO tier name
    private static String getRarityTierName(String rarity) {
        switch (rarity) {
            case "GOLD":       return "Rare Special Item";
            case "Rare (Red)": return "Covert";
            case "Pink":       return "Classified";
            case "Purple":     return "Restricted";
            default:           return "Mil-Spec Grade";
        }
    }

    private static String getRarityMessage(String rarity) {
        switch (rarity) {
            case "GOLD":       return "UNBELIEVABLE! A legendary GOLD drop!";
            case "Rare (Red)": return "INSANE! An ultra rare Covert drop!";
            case "Pink":       return "Sick! A Classified skin!";
            case "Purple":     return "Not bad! A Restricted skin.";
            default:           return "A Mil-Spec drop. Try your luck again!";
        }
    }

    // Estimates market price based on skin, wear, and prefix
    private static double getSkinPrice(String skin, String wear, String prefix) {
        double base;
        String s = skin.replace("\u2605 ", "");

        switch (s) {
            case "Karambit | Doppler":            base = 500;   break;
            case "Butterfly Knife | Fade":        base = 700;   break;
            case "M9 Bayonet | Marble Fade":      base = 400;   break;
            case "Sport Gloves | Pandora's Box":  base = 600;   break;
            case "AWP | Dragon Lore":             base = 1500;  break;
            case "AK-47 | Wild Lotus":            base = 800;   break;
            case "M4A4 | Howl":                   base = 2000;  break;
            case "Desert Eagle | Blaze":          base = 200;   break;
            case "AK-47 | Vulcan":                base = 80;    break;
            case "USP-S | Kill Confirmed":        base = 40;    break;
            case "AWP | Hyper Beast":             base = 60;    break;
            case "M4A1-S | Hyper Beast":          base = 30;    break;
            case "AK-47 | Redline":               base = 10;    break;
            case "AWP | Asiimov":                 base = 15;    break;
            case "Glock-18 | Water Elemental":    base = 5;     break;
            case "P90 | Asiimov":                 base = 8;     break;
            case "MP9 | Hot Rod":                 base = 3;     break;
            case "P250 | Sand Dune":              base = 0.50;  break;
            case "Nova | Predator":               base = 1;     break;
            case "MAG-7 | Sonar":                 base = 1.50;  break;
            default:                              base = 1;     break;
        }

        double wearMult;
        switch (wear) {
            case "Factory New":  wearMult = 1.50; break;
            case "Minimal Wear": wearMult = 1.20; break;
            case "Field-Tested": wearMult = 1.00; break;
            case "Well-Worn":    wearMult = 0.70; break;
            default:             wearMult = 0.50; break;
        }

        double prefixMult = prefix.equals("StatTrak\u2122") ? 1.5
                          : prefix.equals("Souvenir")       ? 1.3
                          : 1.0;

        return base * wearMult * prefixMult;
    }
}