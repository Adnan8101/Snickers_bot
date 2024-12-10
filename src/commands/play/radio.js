// Filename: radio.js
// Description: Stream live radio stations.

const { MessageEmbed } = require('discord.js');
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    name: 'radio',
    description: 'Stream live radio stations.',
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');

        const stationUrl = args[0];
        if (!stationUrl) return message.channel.send('Please provide a radio station URL.');

        const player = createAudioPlayer();

        try {
            const stream = ytdl(stationUrl, { filter: 'audioonly' });
            const resource = createAudioResource(stream, { inlineVolume: true });
            player.play(resource);

            voiceChannel.join().then(connection => {
                connection.subscribe(player);
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Now Streaming')
                    .setDescription(`Streaming from: ${stationUrl}`)
                    .setTimestamp();

                message.channel.send(embed);
            });
        } catch (error) {
            console.error(error);
            message.channel.send('Error streaming the radio station. Please check the URL or try again later.');
        }
    },
};
