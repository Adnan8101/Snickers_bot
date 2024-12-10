const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'vckick',
    description: 'Kicks a user from a voice channel.',
    category: 'Voice channel',

    async execute(message) {
        // Get the target user by mention or ID
        const targetUser = message.mentions.members.first() || message.guild.members.cache.get(message.content.split(" ")[1]);

        if (!message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            return message.reply('You need the "Move Members" permission to use this command.');
        }

        if (targetUser && targetUser.voice.channel) {
            await targetUser.voice.disconnect();
            message.reply(`${targetUser.displayName} has been kicked from the voice channel.`);
        } else {
            message.reply('The specified user is not in any voice channel.');
        }
    }
};
