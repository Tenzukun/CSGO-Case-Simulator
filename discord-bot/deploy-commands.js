const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('open')
        .setDescription('Open a CS:GO crate and see what you get!'),

    new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('View all the skins you have rolled so far.'),

    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View your overall crate opening statistics.'),

    new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Clear your entire inventory and stats.')

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Slash commands registered successfully!');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
})();