const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'vcundeaf',
    description: 'Undeafens a user in a voice channel.',
    category: 'Voice channel',

    async execute(message) {
        // Get the target user by mention or ID
        const targetUser = message.mentions.members.first() || message.guild.members.cache.get(message.content.split(" ")[1]);

        // Check for the "Deafen Members" permission
        if (!message.member.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
            return message.reply('You need the "Deafen Members" permission to use this command.');
        }

        if (targetUser && targetUser.voice.channel) {
            await targetUser.voice.setDeaf(false).catch(error => console.error(`Could not undeafen ${targetUser.displayName}:`, error));
            message.reply(`${targetUser.displayName} has been undeafened.`);
        } else {
            message.reply('The specified user is not in any voice channel.');
        }
    }
};
