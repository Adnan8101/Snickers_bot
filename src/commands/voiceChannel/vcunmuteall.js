const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'vcunmuteall',
    description: 'Unmutes all users in the author\'s voice channel.',
    category: 'Voice channel',

    async execute(message) {
        const authorChannel = message.member.voice.channel;

        // Check for the "Mute Members" permission
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply('You need the "Mute Members" permission to use this command.');
        }

        if (authorChannel) {
            authorChannel.members.forEach(member => {
                member.voice.setMute(false).catch(error => console.error(`Could not unmute ${member.displayName}:`, error));
            });
            message.reply('All users in your voice channel have been unmuted.');
        } else {
            message.reply('You are not in any voice channel.');
        }
    }
};
