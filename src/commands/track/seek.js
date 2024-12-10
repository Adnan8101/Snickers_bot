// Filename: seek.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'seek',
    description: 'Displays the current playback status.',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue || !serverQueue.currentTrack) {
            return message.channel.send('No track is currently playing.');
        }

        const { currentTrack, player } = serverQueue;
        const currentPosition = Math.floor(player.state.resource.playbackDuration / 1000); // in seconds
        const duration = Math.floor(currentTrack.durationMs / 1000); // in seconds
        const remaining = duration - currentPosition;

        const totalBars = 20;  // Number of bars in the timeline
        const progress = Math.floor((currentPosition / duration) * totalBars);
        const timeline = '—'.repeat(progress) + '⚪' + '—'.repeat(totalBars - progress - 1);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Now Playing: ${currentTrack.title}`)
            .setDescription(`[${currentTrack.title}](${currentTrack.url})`)
            .addFields(
                { name: 'Duration', value: `${formatDuration(currentPosition)} ${timeline} ${formatDuration(duration)}`, inline: false },
                { name: 'Time Remaining', value: formatDuration(remaining), inline: true }
            )
            .setThumbnail(currentTrack.thumbnail)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
