// Filename: songinfo.js
// Description: Display information for a specific song.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'songinfo',
    description: 'Display detailed information about a specific song.',
    execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        const songIndex = parseInt(args[0]) - 1;

        if (!serverQueue || !serverQueue.songs[songIndex]) {
            return message.channel.send('Please provide a valid song number.');
        }

        const song = serverQueue.songs[songIndex];
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Song Info')
            .setDescription(`**${song.title}**`)
            .addField('URL', song.url)
            .addField('Duration', song.duration)
            .addField('Requested by', song.requestedBy)
            .setTimestamp();

        message.channel.send(embed);
    },
};
