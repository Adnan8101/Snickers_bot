// Filename: resume.js
// Description: Resume playback.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'resume',
    description: 'Resume the paused track.',
    category: 'Control',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue || serverQueue.playing) {
            const embed = new MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle('Resume Error')
                .setDescription('There is no song currently paused.')
                .setTimestamp();
            return message.channel.send({ embeds: [embed] });
        }

        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        
        const embed = new MessageEmbed()
            .setColor('#FFC0CB')
            .setTitle('Playback Resumed')
            .setDescription('The current track has been resumed.')
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
