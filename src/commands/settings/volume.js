// Filename: volume.js
// Description: Adjust playback volume.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'volume',
    description: 'Adjust the playback volume.',
    execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        const volume = args[0];

        if (!serverQueue || !volume) {
            return message.channel.send('Please provide a volume level (0-100).');
        }

        const validVolume = parseInt(volume);
        if (isNaN(validVolume) || validVolume < 0 || validVolume > 100) {
            return message.channel.send('Please provide a valid volume level (0-100).');
        }

        serverQueue.volume = validVolume;
        serverQueue.connection.dispatcher.setVolumeLogarithmic(validVolume / 100);
        const embed = new MessageEmbed()
            .setColor('#ffcc00')
            .setTitle('Volume Adjusted')
            .setDescription(`Volume set to: ${validVolume}`)
            .setTimestamp();

        message.channel.send(embed);
    },
};
