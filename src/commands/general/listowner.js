const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'listowner',
    description: 'Lists the owners of the bot.',
    category: 'General',
    
    async execute(message, args) {
        const config = require('../../../config.json'); // Adjust path as necessary
        const ownerIds = config.ownerIds || [];

        if (ownerIds.length === 0) {
            return message.reply("No owners have been set in the configuration.");
        }

        const ownersList = ownerIds.map(id => `<@${id}>`).join(', ');

        const embed = new EmbedBuilder()
            .setColor('#FFC0CB')
            .setTitle('Bot Owners')
            .setDescription(` ${ownersList}`)
            .setTimestamp();

        return message.channel.send({ embeds: [embed] });
    },
    
    // This allows the command to work with interactions (slash commands)
    async executeSlash(interaction) {
        const config = require('../../../config.json'); // Path is correct
        const ownerIds = config.ownerIds || [];

        if (ownerIds.length === 0) {
            return interaction.reply("No owners have been set in the configuration.");
        }

        const ownersList = ownerIds.map(id => `<@${id}>`).join(', ');

        const embed = new EmbedBuilder()
            .setColor('#FFC0CB')
            .setTitle('Bot Owners')
            .setDescription(`The owners of this bot are: ${ownersList}`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};
