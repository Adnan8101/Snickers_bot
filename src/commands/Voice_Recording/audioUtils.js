const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function convertToMP3(inputPath, outputPath, callback) {
    exec(`ffmpeg -i ${inputPath} -vn -ar 44100 -ac 2 -ab 192k -f mp3 ${outputPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting audio: ${stderr}`);
            callback(error, null);
        } else {
            console.log('Audio converted successfully');
            callback(null, outputPath);
        }
    });
}

module.exports = { convertToMP3 };
