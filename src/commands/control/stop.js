// Filename: stop.js
// Description: Stop playback and leave voice channel.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'stop',
    description: 'Stop playback and leave the voice channel.',
    category: 'Control',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue) {
            const embed = new MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle('No Playback')
                .setDescription('There is no song playing right now.')
                .setTimestamp();
            return message.channel.send({ embeds: [embed] });
        }

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        serverQueue.voiceChannel.leave();

        const embed = new MessageEmbed()
            .setColor('#FFC0CB')
            .setTitle('Stopped Playback')
            .setDescription('The music has been stopped and the bot has left the channel.')
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
