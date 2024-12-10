const { PermissionsBitField } = require('discord.js');
const { startRecording } = require('./record');

module.exports = {
    name: 'record-start',
    description: 'Start recording the audio in the voice channel.',
    category: 'Voice channel',

    async execute(message) {
        const authorVoiceChannel = message.member.voice.channel;
        if (!authorVoiceChannel) {
            return message.reply('You need to join a voice channel to start recording.');
        }

        // Check if the user has the required permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply('You need the "Mute Members" permission to use this command.');
        }

        try {
            await startRecording(authorVoiceChannel);
            message.reply('Recording started!');
        } catch (err) {
            console.error('Error starting recording:', err);
            message.reply('There was an error starting the recording.');
        }
    }
};
