const fs = require('fs');
const path = require('path');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const prism = require('prism-media');
const ffmpeg = require('fluent-ffmpeg');

let isRecording = false;
let connection = null;
let recordingStream = null;
let startTime = null;

// Ensure the 'Recorded Voice' directory exists
const recordedVoicePath = path.join(__dirname, 'Recorded Voice');
if (!fs.existsSync(recordedVoicePath)) {
    fs.mkdirSync(recordedVoicePath, { recursive: true });
    console.log("Created 'Recorded Voice' directory.");
}

const startRecording = (voiceChannel) => {
    if (isRecording) {
        throw new Error('Recording is already in progress.');
    }

    isRecording = true;
    connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
        console.log("Bot is connected and ready!");
        if (connection && connection.state.subscription) {
            connection.state.subscription.voiceState.setDeaf(false);
            console.log('Bot undeafened!');
        }
    }).on('error', (error) => {
        console.error('Error in voice connection:', error);
    });

    const outputPath = path.join(recordedVoicePath, 'output.raw');
    const fileStream = fs.createWriteStream(outputPath);

    // Handling speaking event to capture audio
    connection.receiver.speaking.on('start', (userId) => {
        console.log(`User ${userId} started speaking.`);
        const audioStream = connection.receiver.subscribe(userId, { end: 'manual' });

        // Create Opus decoder with error handling
        const decoder = new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 });

        // Pipe audio stream through decoder and write to file
        audioStream.pipe(decoder).pipe(fileStream).on('error', (err) => {
            console.error('Error during audio stream piping:', err);
            // Skip corrupted packets and continue
        });

        decoder.on('error', (err) => {
            console.error('Decoder error:', err);
            // Skip corrupted packets
            // Optionally, retry mechanism or further logic could be added here
        });

        // Log the start time for the recording
        startTime = Date.now();
    }).on('error', (err) => {
        console.error('Error while subscribing to audio stream:', err);
    });

    recordingStream = fileStream;
};

const stopRecording = async () => {
    if (!isRecording) {
        throw new Error('No recording in progress.');
    }

    isRecording = false;
    const rawFilePath = path.join(recordedVoicePath, 'output.raw');
    const mp3FilePath = path.join(recordedVoicePath, 'output.mp3');

    // Convert raw audio to MP3 using ffmpeg with better error handling
    return new Promise((resolve, reject) => {
        ffmpeg(rawFilePath)
            .audioCodec('libmp3lame')
            .toFormat('mp3')
            .on('end', () => {
                console.log('Recording saved as MP3');
                resolve({ rawFilePath, mp3FilePath });
            })
            .on('error', (err) => {
                console.error('Error during MP3 conversion:', err);
                reject(err);
            })
            .save(mp3FilePath);
    });
};

const logElapsedTime = () => {
    if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        console.log(`Recording time elapsed: ${elapsed} seconds`);
    }
};

// Error handling for possible out-of-range buffer offsets
const handleVoicePacketError = (err) => {
    console.error('Error while parsing voice packet:', err);
    if (err.code === 'ERR_OUT_OF_RANGE') {
        console.log('The packet size or offset might be incorrect. Skipping this packet.');
        // Skip problematic user or re-attempt if needed
    }
};

// Event listener for voice packet errors
const handleVoiceDataError = (packet) => {
    console.error('Error while processing voice data:', packet);
};

// Monitoring the audio stream and handling corrupted data packets
const monitorAudioStream = (audioStream) => {
    audioStream.on('error', (err) => {
        console.error('Error during audio stream handling:', err);
        // Implement retry logic or skip corrupted stream
    });
};

module.exports = { startRecording, stopRecording, logElapsedTime, handleVoicePacketError, monitorAudioStream };
