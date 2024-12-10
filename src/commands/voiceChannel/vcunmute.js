const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'vcunmute',
    description: 'Unmutes a user in a voice channel.',
    category: 'Voice channel',

    async execute(message) {
        // Get the target user by mention or ID
        const targetUser = message.mentions.members.first() || message.guild.members.cache.get(message.content.split(" ")[1]);

        // Check for the "Mute Members" permission
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply('You need the "Mute Members" permission to use this command.');
        }

        if (targetUser && targetUser.voice.channel) {
            await targetUser.voice.setMute(false).catch(error => console.error(`Could not unmute ${targetUser.displayName}:`, error));
            message.reply(`${targetUser.displayName} has been unmuted.`);
        } else {
            message.reply('The specified user is not in any voice channel.');
        }
    }
};
