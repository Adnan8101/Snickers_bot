// Filename: pause.js
// Description: Pause playback.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Pause the currently playing track.',
    category: 'Control',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue || !serverQueue.playing) {
            const embed = new MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle('Pause Error')
                .setDescription('There is no song playing right now.')
                .setTimestamp();
            return message.channel.send({ embeds: [embed] });
        }

        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();

        const embed = new MessageEmbed()
            .setColor('#FFC0CB')
            .setTitle('Playback Paused')
            .setDescription('The current track has been paused.')
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
