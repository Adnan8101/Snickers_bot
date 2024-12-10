// Filename: load.js
// Description: Load a saved playlist.

const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'load',
    description: 'Load a saved playlist.',
    execute(message, args) {
        const playlistName = args[0];

        if (!playlistName) {
            return message.channel.send('Please provide the name of the playlist to load.');
        }

        try {
            const data = fs.readFileSync(playlistName, 'utf8');
            const songs = JSON.parse(data);
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Playlist Loaded')
                .setDescription(`Loaded ${songs.length} songs from the playlist.`)
                .setTimestamp();

            message.channel.send(embed);
        } catch (error) {
            console.error(error);
            message.channel.send('Error loading the playlist. Please check the file name and try again.');
        }
    },
};
