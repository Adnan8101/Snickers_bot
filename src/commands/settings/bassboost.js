// Filename: bassboost.js
// Description: Enable bass boost for extra depth.

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'bassboost',
    description: 'Enable bass boost for extra depth.',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue) {
            return message.channel.send('There is no song playing right now.');
        }

        // Enable bass boost logic here
        serverQueue.bassBoost = !serverQueue.bassBoost; // Toggle bass boost
        const embed = new MessageEmbed()
            .setColor('#ffcc00')
            .setTitle('Bass Boost')
            .setDescription(`Bass boost is now ${serverQueue.bassBoost ? 'enabled' : 'disabled'}.`)
            .setTimestamp();

        message.channel.send(embed);
    },
};
