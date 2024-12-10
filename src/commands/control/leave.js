const { CommandInteraction, MessageEmbed } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'leave',
    description: 'Make the bot leave the voice channel.',
    category: 'Control',
    async execute(interaction) {
        const { guild } = interaction;
        const connection = getVoiceConnection(guild.id);

        if (!connection) {
            const embed = new MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle('Leave Error')
                .setDescription('I am not currently in a voice channel!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }

        connection.disconnect();
        const embed = new MessageEmbed()
            .setColor('#FFC0CB')
            .setTitle('Left Voice Channel')
            .setDescription('Left the voice channel successfully!')
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    },
};
