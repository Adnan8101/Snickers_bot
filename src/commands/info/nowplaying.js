// Filename: nowplaying.js
// Description: Show current track details.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'nowplaying',
    description: 'Show the currently playing track.',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue || !serverQueue.songs.length) {
            return message.channel.send('There is no song playing right now.');
        }

        const song = serverQueue.songs[0];
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Now Playing')
            .setDescription(`**${song.title}**`)
            .addField('Requested by', `${song.requestedBy}`)
            .setTimestamp();

        message.channel.send(embed);
    },
};
