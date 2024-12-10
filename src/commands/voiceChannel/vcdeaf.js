module.exports = {
    name: 'vcdeaf',
    description: 'Deafens a user in a voice channel.',
    category: 'Voice channel',

    async execute(message) {
        const targetUser = message.mentions.members.first();
        if (targetUser && targetUser.voice.channel) {
            await targetUser.voice.setDeaf(true);
            message.reply(`${targetUser.displayName} has been deafened.`);
        } else {
            message.reply('The specified user is not in any voice channel.');
        }
    }
};
