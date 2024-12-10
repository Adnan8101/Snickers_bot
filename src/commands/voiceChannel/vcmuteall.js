const { PermissionsBitField } = require('discord.js');
const antiratelimit = require('anti-rate-limit')

module.exports = {
    name: 'vcmuteall',
    description: 'Mutes all users in the author\'s voice channel.',
    category: 'Voice channel',

    async execute(message) {
        const authorChannel = message.member.voice.channel;

        // Check if the author has the "Mute Members" permission
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply('You need the "Mute Members" permission to use this command.');
        }

        // Check if the author is in a voice channel
        if (authorChannel) {
            authorChannel.members.forEach(member => {
                member.voice.setMute(true).catch(error => console.error(`Could not mute ${member.displayName}:`, error));
            });
            message.reply('All users in your voice channel have been muted.');
        } else {
            message.reply('You are not in any voice channel.');
        }
    }
};
