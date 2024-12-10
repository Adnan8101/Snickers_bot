// Filename: treble.js
// Description: Adjust treble levels.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'treble',
    description: 'Adjust treble levels.',
    execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        const treble = args[0];

        if (!serverQueue || !treble) {
            return message.channel.send('Please provide a treble level (0-100).');
        }

        const validTreble = parseInt(treble);
        if (isNaN(validTreble) || validTreble < 0 || validTreble > 100) {
            return message.channel.send('Please provide a valid treble level (0-100).');
        }

        serverQueue.treble = validTreble;
        // Logic to apply treble effect
        const embed = new MessageEmbed()
            .setColor('#ffcc00')
            .setTitle('Treble Adjusted')
            .setDescription(`Treble set to: ${validTreble}`)
            .setTimestamp();

        message.channel.send(embed);
    },
};
