const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ownerIds } = require('../../../config.json');

module.exports = {
    name: 'help',
    description: 'Displays all available commands categorized by type.',
    execute(message) {
        const categories = {};

        // Organize commands by category and filter owner-only commands if not an owner
        message.client.commands.forEach(command => {
            if (command.ownerOnly && !ownerIds.includes(message.author.id)) return;

            const category = command.category || 'Uncategorized';
            if (!categories[category]) categories[category] = [];
            categories[category].push(`\`${command.name}\``);
        });

        const embed = new EmbedBuilder()
            .setColor('#FFC0CB')
            .setTitle('✨ Help - Available Commands ✨')
            .setDescription('Here are the available commands organized by category. Use the command prefix to execute them.')
            .setFooter({ text: 'Thank you for using the Snickers Music ! 💖', iconURL: message.client.user.displayAvatarURL() })
            .setTimestamp();

        // Add each category and commands to the embed
        for (const [category, commands] of Object.entries(categories)) {
            embed.addFields({ name: `📂 ${category}`, value: commands.join(', '), inline: false });
        }

        // Action row with buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://support-server-link.com'),
                new ButtonBuilder()
                    .setLabel('Command Documentation')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://commands-link.com')
            );

        message.channel.send({ embeds: [embed], components: [row] })
            .catch(error => console.error('Error sending help embed:', error));
    }
};
