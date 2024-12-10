const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClientId, spotifyClientSecret } = require('../../config.json');

const spotifyApi = new SpotifyWebApi({
    clientId: spotifyClientId,
    clientSecret: spotifyClientSecret,
});

// Authenticate with Spotify
async function authenticateSpotify() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body.access_token);
        console.log('✅ Spotify token obtained and authenticated successfully.');
    } catch (error) {
        console.error('❌ Error authenticating with Spotify:', error.message);
    }
}

// Export with a name property to allow `loadUtils` to recognize it as a utility
module.exports = {
    name: 'spotifyApi',  // Required for loadUtils in index.js
    spotifyApi,
    authenticateSpotify,
};
