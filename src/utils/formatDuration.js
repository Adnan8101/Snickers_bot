// Filename: formatDuration.js
// Description: Formats a duration in seconds to HH:MM:SS or MM:SS.

module.exports = function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');

    if (hrs > 0) {
        // Format as HH:MM:SS if the duration is 1 hour or more
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs}`;
    } else {
        // Format as MM:SS for durations less than 1 hour
        return `${mins}:${secs}`;
    }
};
