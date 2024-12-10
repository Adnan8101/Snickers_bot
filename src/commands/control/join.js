const { CommandInteraction, MessageEmbed } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: 'join',
    description: 'Make the bot join your voice channel.',
    category: 'Control',
    async execute(interaction) {
        const member = interaction.member;

        if (!member.voice.channel) {
            const embed = new MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle('Join Error')
                .setDescription('You need to be in a voice channel to use this command!')
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }

        try {
            const connection = joinVoiceChannel({
                channelId: member.voice.channel.id,
                guildId: member.guild.id,
                adapterCreator: member.guild.voiceAdapterCreator,
            });

            const embed = new MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle('Voice Channel Joined')
                .setDescription(`Joined **${member.voice.channel.name}**!`)
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error joining voice channel:', error);
            const embed = new MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle('Join Error')
                .setDescription('Failed to join the voice channel. Please try again later.')
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        }
    },
};
