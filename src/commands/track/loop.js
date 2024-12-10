// Filename: loop.js
// Description: Loop track/playlist.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'loop',
    description: 'Loop the current track or the entire queue.',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue) {
            return message.channel.send('There is no song playing right now.');
        }

        serverQueue.loop = !serverQueue.loop; // Toggle looping
        const embed = new MessageEmbed()
            .setColor('#ff00ff')
            .setTitle('Looping')
            .setDescription(`Looping is now ${serverQueue.loop ? 'enabled' : 'disabled'}.`)
            .setTimestamp();

        message.channel.send(embed);
    },
};
