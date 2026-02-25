const CLIENT_ID = '3b7f70c861414017932f824682f734bf';
const CLIENT_SECRET = 'f7eb2b8909b844629c37d43212138738';

export const getSpotifyToken = async () => {
  const authString = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
};

export const searchSpotifyTracks = async (query) => {
  if (!query) return [];
  
  const token = await getSpotifyToken();
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=15`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  // Format the Spotify data to match your PlayerStore structure
  return data.tracks.items.map(track => ({
    id: track.id,
    _id: track.id, // compatibility
    title: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    imageUrl: track.album.images[0]?.url,
    audioUrl: track.preview_url, // 30s preview
    duration: "0:30",
    album: track.album.name
  }));
};