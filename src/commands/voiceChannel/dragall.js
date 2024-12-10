const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'moveall',
    description: 'Moves all members from your voice channel to a specified voice channel.',
    category: 'Voice Channel',

    async execute(message, args) {
        const targetChannelId = args[0];  // Get the provided channel ID

        if (!targetChannelId) {
            return message.reply('Please provide a valid voice channel ID.');
        }

        let targetChannel;
        try {
            // Fetch the target channel
            targetChannel = await message.guild.channels.fetch(targetChannelId);
        } catch (error) {
            return message.reply('The provided channel ID is not valid or does not exist.');
        }

        // Ensure the target channel is a valid voice channel
        if (targetChannel.type !== 'GUILD_VOICE') {
            return message.reply('The provided channel ID is not a valid voice channel.');
        }

        // Ensure the user has the "Move Members" permission
        if (!message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            return message.reply('You need the "Move Members" permission to use this command.');
        }

        // Ensure the bot has the "Move Members" permission
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            return message.reply('I need the "Move Members" permission to move users.');
        }

        // Get the voice channel of the user who used the command
        const userVoiceChannel = message.member.voice.channel;

        if (!userVoiceChannel) {
            return message.reply('You need to be in a voice channel to use this command.');
        }

        // Ensure the bot can connect to the target voice channel
        if (!targetChannel.permissionsFor(message.guild.members.me).has([PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak])) {
            return message.reply('I do not have permission to connect or speak in the target voice channel.');
        }

        // Filter out bot members, and only move users
        const membersToMove = userVoiceChannel.members.filter(member => !member.user.bot);

        if (membersToMove.size === 0) {
            return message.reply('There are no users in your voice channel to move.');
        }

        try {
            // Move each member to the target channel
            for (const member of membersToMove.values()) {
                await member.voice.setChannel(targetChannel);
            }

            message.reply(`Successfully moved ${membersToMove.size} members to ${targetChannel.name}.`);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while trying to move users.');
        }
    }
};
