// Filename: remove.js
// Description: Remove a specific track from the queue.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'remove',
    description: 'Remove a specific track from the queue.',
    execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue) {
            return message.channel.send('There is no song playing right now.');
        }

        const index = parseInt(args[0]) - 1;

        if (isNaN(index) || index < 0 || index >= serverQueue.songs.length) {
            return message.channel.send('Please provide a valid song number to remove.');
        }

        const removedSong = serverQueue.songs.splice(index, 1)[0];
        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Track Removed')
            .setDescription(`Removed track: ${removedSong.title}`)
            .setTimestamp();

        message.channel.send(embed);
    },
};
