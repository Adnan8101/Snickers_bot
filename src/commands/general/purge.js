const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'purge',
    description: 'Purges messages with options to target all, bots, humans, or a specific user',
    aliases: [
        'clear', 
        'purge bots', 'clear bots', 'pb', 'cb',
        'purge human', 'clear human', 'purge humans', 'clear humans',
        'purge all', 'clear all'
    ],

    async execute(message, args) {
        // Check for permissions
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("❌ You need 'Manage Messages' permission to use this command.");
        }

        // Set default values
        let target = 'all'; // Options: 'all', 'bots', 'human', 'user'
        let amount = 10; // Default amount if not specified
        let user = null;

        // Determine target type and amount based on arguments
        if (args[0]) {
            const targetArg = args[0].toLowerCase();
            if (['all', 'bots', 'human', 'pb', 'cb'].includes(targetArg)) {
                target = targetArg === 'pb' || targetArg === 'cb' ? 'bots' : targetArg;
                amount = parseInt(args[1]) || 10; // Use the specified amount or default to 10
            } else if (message.mentions.users.size > 0 || /^\d+$/.test(args[0])) {
                // Set target for specific user (user mention or ID)
                target = 'user';
                user = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
                amount = parseInt(args[1]) || 10;
                if (!user) return message.reply("❌ Could not find that user.");
            } else {
                // If only an amount is provided
                amount = parseInt(args[0]) || 10;
            }
        }

        // Limit the amount to a maximum of 500
        amount = Math.min(amount, 500);

        // Fetch and filter messages based on the target
        try {
            const messages = await message.channel.messages.fetch({ limit: amount });
            let filteredMessages;

            // Filter messages based on the target
            switch (target) {
                case 'bots':
                    filteredMessages = messages.filter(msg => msg.author.bot);
                    break;
                case 'human':
                    filteredMessages = messages.filter(msg => !msg.author.bot);
                    break;
                case 'user':
                    filteredMessages = messages.filter(msg => msg.author.id === user.id);
                    break;
                default:
                    filteredMessages = messages;
            }

            // Bulk delete the filtered messages
            await message.channel.bulkDelete(filteredMessages, true);

            // Send a confirmation message
            const embed = new EmbedBuilder()
                .setColor('#FFB6C1')
                .setTitle('🧹 Purge Completed')
                .setDescription(
                    `Purged **${filteredMessages.size}** ${
                        target === 'bots' ? 'bot' :
                        target === 'human' ? 'human' :
                        target === 'user' ? `messages from ${user.tag}` : 'all'
                    } messages.`
                )
                .setFooter({
                    text: `Requested by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 5000); // Delete confirmation message after 5 seconds
            });
        } catch (error) {
            console.error("Error purging messages:", error);
            message.reply("There was an error trying to purge messages in this channel.");
        }
    },
};
