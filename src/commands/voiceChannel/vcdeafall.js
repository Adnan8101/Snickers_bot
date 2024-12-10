const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'vcdeafall',
    description: 'Deafens all users in the author\'s voice channel.',
    category: 'Voice channel',

    async execute(message) {
        const authorChannel = message.member.voice.channel;

        // Check if the author has the necessary permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
            return message.reply('You need the "Deafen Members" permission to use this command.');
        }

        // Check if the author is in a voice channel
        if (authorChannel) {
            // Deafens all members in the author's channel
            authorChannel.members.forEach(member => {
                member.voice.setDeaf(true).catch(error => console.error(`Could not deafen ${member.displayName}:`, error));
            });
            message.reply('All users in your voice channel have been deafened.');
        } else {
            message.reply('You are not in any voice channel.');
        }
    }
};
