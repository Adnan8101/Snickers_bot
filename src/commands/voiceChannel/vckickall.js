const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'vckickall',
    description: 'Kicks all users from the author\'s voice channel.',
    category: 'Voice channel',

    async execute(message) {
        const authorChannel = message.member.voice.channel;

        // Check if the author has the "Move Members" permission
        if (!message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            return message.reply('You need the "Move Members" permission to use this command.');
        }

        // Check if the author is in a voice channel
        if (authorChannel) {
            authorChannel.members.forEach(member => {
                member.voice.disconnect().catch(error => console.error(`Could not disconnect ${member.displayName}:`, error));
            });
            message.reply('All users have been kicked from your voice channel.');
        } else {
            message.reply('You are not in any voice channel.');
        }
    }
};
