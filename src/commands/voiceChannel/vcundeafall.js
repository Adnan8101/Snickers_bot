const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'vcundeafall',
    description: 'Undeafens all users in the author\'s voice channel.',
    category: 'Voice channel',

    async execute(message) {
        const authorChannel = message.member.voice.channel;

        // Check for the "Deafen Members" permission
        if (!message.member.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
            return message.reply('You need the "Deafen Members" permission to use this command.');
        }

        if (authorChannel) {
            authorChannel.members.forEach(member => {
                member.voice.setDeaf(false).catch(error => console.error(`Could not undeafen ${member.displayName}:`, error));
            });
            message.reply('All users in your voice channel have been undeafened.');
        } else {
            message.reply('You are not in any voice channel.');
        }
    }
};
