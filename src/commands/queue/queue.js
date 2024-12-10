// Filename: queue.js
// Description: Show the current queue.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'View the current queue.',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue || !serverQueue.songs.length) {
            return message.channel.send('There are no songs in the queue right now.');
        }

        const queueList = serverQueue.songs.map((song, index) => `${index + 1}. ${song.title}`).join('\n');

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Current Queue')
            .setDescription(queueList)
            .setTimestamp();

        message.channel.send(embed);
    },
};
