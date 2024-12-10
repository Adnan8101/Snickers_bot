const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { SPOTIFY_API_KEY, YOUTUBE_API_KEY } = require('../../../config.json'); // Ensure correct path to config.json
const path = require('path');

module.exports = {
  name: 'play',
  description: 'Play a song from Spotify, YouTube, or search for a song.',
  async execute(message, args) {
    const voiceChannel = message.member.voice.channel;

    // Check if the user is in a voice channel
    if (!voiceChannel) {
      return message.reply('You need to join a voice channel first!');
    }

    const song = args.join(' '); // Get the song name or URL from the user's message

    try {
      let songData;

      // Check if the song is a Spotify or YouTube URL
      if (song.includes('spotify.com')) {
        songData = await getSpotifyTrack(song); // Retrieve Spotify track data
      } else if (song.includes('youtube.com') || song.includes('youtu.be')) {
        songData = await getYouTubeTrack(song); // Retrieve YouTube track data
      } else {
        // If it's not a URL, search for the song
        songData = await searchSong(song);
      }

      if (!songData) {
        return message.reply('Could not find the song.');
      }

      // Join the voice channel
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      // Play the song
      await playSong(songData, connection);

      // Send confirmation message
      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Now Playing')
        .setDescription(`🎶 Now playing: ${songData.title}`)
        .setURL(songData.url)
        .setThumbnail(songData.thumbnail);

      message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Error playing song:', error);
      message.reply('There was an error trying to play that song!');
    }
  },
};

// Function to play the song
async function playSong(songData, connection) {
  const player = createAudioPlayer();

  // Prepare the audio resource for the song (this could be a YouTube or Spotify URL)
  const resource = createAudioResource(songData.url); // Make sure songData.url is a direct audio stream URL

  player.play(resource);

  // Listen for the audio player status
  player.on(AudioPlayerStatus.Playing, () => {
    console.log('The audio is now playing!');
  });

  player.on(AudioPlayerStatus.Idle, () => {
    console.log('The audio has finished playing.');
    connection.destroy(); // Destroy the connection when the song finishes
  });

  // Add the player to the voice connection
  connection.subscribe(player);
}

// Fetch the song details from Spotify
async function getSpotifyTrack(url) {
  const trackId = url.split('/').pop(); // Assuming the URL format is "https://open.spotify.com/track/{trackId}"
  const apiUrl = `https://api.spotify.com/v1/tracks/${trackId}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${SPOTIFY_API_KEY}` }
    });

    const track = response.data;
    return {
      title: track.name,
      url: track.external_urls.spotify,
      thumbnail: track.album.images[0]?.url || '',
    };
  } catch (error) {
    console.error('Error fetching from Spotify:', error);
    return null;
  }
}

// Fetch the song details from YouTube
async function getYouTubeTrack(url) {
  const videoId = url.split('v=')[1]?.split('&')[0]; // Extract video ID from YouTube URL
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const video = response.data.items[0];

    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: video.snippet.thumbnails.high.url,
    };
  } catch (error) {
    console.error('Error fetching from YouTube:', error);
    return null;
  }
}

// Search for a song using YouTube
async function searchSong(query) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(query)}&part=snippet&type=video&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const video = response.data.items[0];

    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      thumbnail: video.snippet.thumbnails.high.url,
    };
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return null;
  }
}
