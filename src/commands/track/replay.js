// Filename: seek.js
// Description: Seek to a specific time in the track.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'seek',
    description: 'Seek to a specific time in the track.',
    execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        const time = args[0];

        if (!serverQueue || !time) {
            return message.channel.send('Please provide a time to seek to.');
        }

        const validTime = parseInt(time);
        if (isNaN(validTime)) {
            return message.channel.send('Please provide a valid number for the time.');
        }

        serverQueue.connection.dispatcher.seek(validTime);
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Track Seeked')
            .setDescription(`Seeked to: ${validTime} seconds`)
            .setTimestamp();

        message.channel.send(embed);
    },
};
