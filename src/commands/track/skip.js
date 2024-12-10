// Filename: skip.js
// Description: Skip to the next track.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Skip the currently playing track.',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue) {
            return message.channel.send('There is no song playing right now.');
        }

        serverQueue.connection.dispatcher.end();
        const embed = new MessageEmbed()
            .setColor('#00ffcc')
            .setTitle('Track Skipped')
            .setDescription('The current track has been skipped.')
            .setTimestamp();

        message.channel.send(embed);
    },
};
