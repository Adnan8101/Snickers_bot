const { stopRecording } = require('./record');

module.exports = {
    name: 'record-stop',
    description: 'Stop recording the audio and save it.',
    category: 'Voice channel',

    async execute(message) {
        try {
            const { rawFilePath, mp3FilePath } = await stopRecording();
            message.reply(`Recording stopped! The MP3 file has been saved at: ${mp3FilePath}`);
        } catch (err) {
            console.error('Error stopping recording:', err);
            message.reply('There was an error stopping the recording.');
        }
    }
};
