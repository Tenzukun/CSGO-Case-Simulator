const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { openCrate, getRarityRank } = require('./rolls');
const { addItem, getItems, getStats, resetUser } = require('./storage');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, user } = interaction;

    // ---------------------------------------------------
    // /open
    // ---------------------------------------------------
    if (commandName === 'open') {
        const result = openCrate();

        addItem(user.id, {
            fullItem: result.fullItem,
            rarity:   result.rarity,
            tier:     result.tier,
            type:     result.type,
            float:    result.floatVal,
            seed:     result.seed,
            price:    result.price,
            prefix:   result.prefix
        });

        const embed = new EmbedBuilder()
            .setColor(result.colour)
            .setTitle('🎉 Crate Opened!')
            .setDescription(getRarityMessage(result.rarity))
            .addFields(
                { name: 'Item',     value: result.fullName,           inline: false },
                { name: 'Exterior', value: result.wear,               inline: true  },
                { name: 'Type',     value: result.type,               inline: true  },
                { name: 'Rarity',   value: result.tier,               inline: true  },
                { name: 'Float',    value: `\`${result.floatVal}\``,  inline: true  },
                { name: 'Seed',     value: `\`${result.seed}\``,      inline: true  },
                { name: 'Price',    value: `~$${result.price}`,       inline: true  }
            )
            .setFooter({ text: 'CS:GO Crate Opening Simulator' })
            .setTimestamp();

        if (result.prefix === 'StatTrak™') {
            const kills = Math.floor(Math.random() * 100000).toLocaleString();
            embed.addFields({ name: 'StatTrak™', value: `${kills} Confirmed Kills`, inline: true });
        }

        await interaction.reply({ embeds: [embed] });
    }

    // ---------------------------------------------------
    // /inventory
    // ---------------------------------------------------
    else if (commandName === 'inventory') {
        const items = getItems(user.id);

        if (items.length === 0) {
            await interaction.reply({ content: 'Your inventory is empty! Use `/open` to roll your first crate.', ephemeral: true });
            return;
        }

        // Split into pages of 10 items each
        const pageSize = 10;
        const page     = items.slice(-pageSize);
        const lines    = page.map((item, i) => {
            const num = items.length - pageSize + i + 1;
            return `**#${num}** ${item.fullItem}\n${item.tier} · ${item.type} · Float: \`${item.float}\` · ~$${item.price}`;
        });

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle(`🎒 ${user.username}'s Inventory`)
            .setDescription(lines.join('\n\n'))
            .setFooter({ text: `Showing last ${page.length} of ${items.length} items` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // ---------------------------------------------------
    // /stats
    // ---------------------------------------------------
    else if (commandName === 'stats') {
        const stats = getStats(user.id);
        const items = getItems(user.id);

        // Find best item by rarity rank
        let bestItem = 'None yet';
        let bestRank = 0;
        for (const item of items) {
            const rank = getRarityRank(item.rarity);
            if (rank > bestRank) {
                bestRank = rank;
                bestItem = item.fullItem;
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`📊 ${user.username}'s Stats`)
            .addFields(
                { name: 'Total Opened', value: `${stats.total}`,  inline: false },
                { name: '🔵 Blue',      value: `${stats.blue}`,   inline: true  },
                { name: '🟣 Purple',    value: `${stats.purple}`, inline: true  },
                { name: '🩷 Pink',      value: `${stats.pink}`,   inline: true  },
                { name: '🔴 Red',       value: `${stats.red}`,    inline: true  },
                { name: '🟡 Gold',      value: `${stats.gold}`,   inline: true  },
                { name: 'Best Roll',    value: bestItem,           inline: false }
            )
            .setFooter({ text: 'CS:GO Crate Opening Simulator' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // ---------------------------------------------------
    // /reset
    // ---------------------------------------------------
    else if (commandName === 'reset') {
        const wasReset = resetUser(user.id);

        if (wasReset) {
            await interaction.reply({ content: '🗑️ Your inventory and stats have been cleared.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Your inventory is already empty!', ephemeral: true });
        }
    }
});

function getRarityMessage(rarity) {
    const messages = {
        'GOLD':       '🌟 UNBELIEVABLE! A legendary GOLD drop!',
        'Rare (Red)': '🔥 INSANE! An ultra rare Covert drop!',
        'Pink':       '😎 Sick! A Classified skin!',
        'Purple':     '👍 Not bad! A Restricted skin.',
        'Blue':       '🎲 A Mil-Spec drop. Try your luck again!'
    };
    return messages[rarity] || '';
}

client.login(process.env.TOKEN);