// Filename: lyrics.js
// Description: Fetch song lyrics.

const { MessageEmbed } = require('discord.js');
const lyricsFinder = require('lyrics-finder');

module.exports = {
    name: 'lyrics',
    description: 'Fetch lyrics for the currently playing song.',
    async execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue) {
            return message.channel.send('There is no song playing right now.');
        }

        const song = serverQueue.songs[0];
        const lyrics = await lyricsFinder(song.title, null) || 'Lyrics not found.';

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Lyrics')
            .setDescription(`**${song.title}**\n${lyrics}`)
            .setTimestamp();

        message.channel.send(embed);
    },
};
