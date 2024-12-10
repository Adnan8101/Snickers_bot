// Filename: save.js
// Description: Save the current queue as a custom playlist.

const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'save',
    description: 'Save the current queue as a custom playlist.',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue) {
            return message.channel.send('There is no song playing right now.');
        }

        const playlistName = `playlist_${Date.now()}.json`;
        fs.writeFileSync(playlistName, JSON.stringify(serverQueue.songs, null, 2));
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Playlist Saved')
            .setDescription(`Your playlist has been saved as: ${playlistName}`)
            .setTimestamp();

        message.channel.send(embed);
    },
};
