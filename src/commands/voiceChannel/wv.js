module.exports = {
    name: 'wv',
    description: 'Shows which voice channel a user is in.',
    category: 'Voice channel',

    async execute(message) {
        // Get the mentioned user or user ID from the command arguments, or get the user from a reply
        let targetUser;
        
        if (message.mentions.members.first()) {
            targetUser = message.mentions.members.first();
        } else if (message.content.split(" ")[1]) {
            targetUser = message.guild.members.cache.get(message.content.split(" ")[1]);
        } else if (message.reference) {
            try {
                // Fetch the original message and get the member who sent it
                const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
                targetUser = repliedMessage.member;
            } catch (error) {
                console.error("Error fetching replied message:", error);
                return message.reply("There was an error fetching the replied message.");
            }
        }

        // Check if a user was specified
        if (!targetUser) {
            return message.reply('Please mention a user or provide thier user ID');
        }

        // Check if the specified user is in a voice channel
        if (targetUser.voice.channel) {
            message.channel.send(`**${targetUser.displayName}** is in the voice channel: <#${targetUser.voice.channel.id}>`, { allowedMentions: { users: [], roles: [] } });
        } else {
            message.reply('The specified user is not in any voice channel.');
        }
    }
};
