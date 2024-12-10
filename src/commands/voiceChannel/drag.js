const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'drag',
    description: 'Drags a user to your current voice channel.',
    category: 'Voice channel',

    async execute(message) {
        // Get the target user by mention or ID
        const targetUser = message.mentions.members.first() || message.guild.members.cache.get(message.content.split(" ")[1]);
        const authorVoiceChannel = message.member.voice.channel;

        if (!message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            return message.reply('You need the "Move Members" permission to use this command.');
        }

        if (!authorVoiceChannel) {
            return message.reply('You need to be in a voice channel to use this command.');
        }

        if (targetUser && targetUser.voice.channel) {
            await targetUser.voice.setChannel(authorVoiceChannel);
            message.reply(`Dragged ${targetUser.displayName} to your voice channel.`);
        } else {
            message.reply('The specified user is not in any voice channel.');
        }
    }
};
