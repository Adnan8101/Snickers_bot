const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

// Connect to the voice channel
const connectToVoiceChannel = (voiceChannel) => {
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    return connection;
};

// Disconnect from the voice channel
const disconnectFromVoiceChannel = (guildId) => {
    const connection = getVoiceConnection(guildId);
    if (connection) {
        connection.destroy();
    } else {
        console.log(`No active connection found for guild ${guildId}.`);
    }
};

module.exports = { connectToVoiceChannel, disconnectFromVoiceChannel };
