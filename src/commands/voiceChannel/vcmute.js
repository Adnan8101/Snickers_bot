module.exports = {
    name: 'vcmute',
    description: 'Mutes a user in a voice channel.',
    category: 'Voice channel',

    async execute(message) {
        // Get the target user by mention or ID
        const targetUser = message.mentions.members.first() || message.guild.members.cache.get(message.content.split(" ")[1]);

        if (targetUser && targetUser.voice.channel) {
            await targetUser.voice.setMute(true);
            message.reply(`${targetUser.displayName} has been muted.`);
        } else {
            message.reply('The specified user is not in any voice channel.');
        }
    }
};
