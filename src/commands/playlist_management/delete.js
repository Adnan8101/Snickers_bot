// Filename: delete.js
// Description: Delete a saved playlist.

const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'delete',
    description: 'Delete a saved playlist.',
    execute(message, args) {
        const playlistName = args[0];

        if (!playlistName) {
            return message.channel.send('Please provide the name of the playlist to delete.');
        }

        fs.unlink(playlistName, (err) => {
            if (err) {
                console.error(err);
                return message.channel.send('Error deleting the playlist. Please check the file name and try again.');
            }
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Playlist Deleted')
                .setDescription(`Deleted playlist: ${playlistName}`)
                .setTimestamp();

            message.channel.send(embed);
        });
    },
};
