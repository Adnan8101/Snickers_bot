const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { prefix } = require('../../../config.json');

module.exports = {
    name: 'mention',
    description: 'Responds with a getting started embed when the bot is mentioned.',
    async execute(message) {
        const botAvatar = message.client.user.displayAvatarURL({ dynamic: true });
        const guildIcon = message.guild ? message.guild.iconURL({ dynamic: true }) : botAvatar;

        const embed = new EmbedBuilder()
            .setColor('#FFC0CB') // Baby pink color
            .setTitle(`👋 Hello from ${message.client.user.username}`)
            .setDescription(`Hi! I'm ${message.client.user.username}, a music bot that plays music from various sources with top quality!`)
            .setThumbnail(botAvatar)
            .addFields(
                { name: 'Prefix', value: `${prefix}`, inline: false },
                { name: 'Premium Status', value: 'Free Version', inline: false },
                { name: 'Play Mode', value: 'Basic', inline: false },
                { name: 'Language', value: 'en', inline: false }
            )
            .setFooter({ text: 'Developed by Byte', iconURL: guildIcon })
            .setTimestamp();

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://support-server-link.com'),
                new ButtonBuilder()
                    .setLabel(`Invite ${message.client.user.username}`)
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://invite-link.com'),
                new ButtonBuilder()
                    .setLabel('Premium')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji('<a:premium:1303354659976511580>') // Add premium emoji if available
                    .setURL('https://premium-link.com')
            );

        await message.channel.send({
            embeds: [embed],
            components: [buttonRow]
        }).catch(error => console.error('Error sending mention embed:', error));
    }
};
