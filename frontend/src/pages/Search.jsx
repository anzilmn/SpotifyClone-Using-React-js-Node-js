import { useState, useEffect } from "react";
import { Search as SearchIcon, Loader2, Music } from "lucide-react";
import SongCard from "../components/SongCard";

const CLIENT_ID = '1fefe49b3f574e719540fdcabee4605b';
const CLIENT_SECRET = 'd85a039f991f4b7f9fbf4c5827876ce7';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fixed Token Fetcher using REAL Spotify Accounts URL
  const getSpotifyToken = async () => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Auth Failed:", errorText);
        return null;
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Critical Auth Error:", error);
      return null;
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const token = await getSpotifyToken();
        if (!token) {
          setLoading(false);
          return;
        }

        // 2. Fixed Search URL using REAL Spotify API URL + Correct Template Literal `${}`
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=30&market=US`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        const data = await response.json();

        if (data.tracks && data.tracks.items) {
          const formattedSongs = data.tracks.items.map((track) => ({
            _id: track.id,
            title: track.name,
            artist: track.artists[0].name,
            imageUrl: track.album.images[0]?.url || "https://via.placeholder.com/300",
            audioUrl: track.preview_url, 
            duration: "0:30",
            album: track.album.name,
            isSpotifyTrack: true
          }));
          setResults(formattedSongs);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search Logic Error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="p-6 lg:p-10 min-h-full bg-[#121212] text-white overflow-y-auto">
      <div className="sticky top-0 z-20 pb-8 bg-[#121212]/90 backdrop-blur-md">
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
          <input
            type="text"
            placeholder="Search for Alan Walker, NCS, etc..."
            className="w-full bg-[#242424] hover:bg-[#2a2a2a] rounded-full py-4 pl-14 pr-6 text-base focus:ring-2 focus:ring-[#1DB954] outline-none transition-all shadow-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-black">{searchTerm ? `Results for "${searchTerm}"` : "Search"}</h2>
        {loading && <Loader2 className="animate-spin text-[#1DB954]" size={24} />}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
          {results.map((song) => (
            <SongCard key={song._id} song={song} allSongs={results} />
          ))}
        </div>
      ) : (
        !loading && searchTerm && (
          <div className="text-gray-500 text-center py-24 bg-white/[0.02] rounded-3xl border border-white/5">
            <Music size={64} className="mx-auto mb-4 opacity-10" />
            <p className="text-xl font-bold text-gray-300">No tracks found</p>
            <p className="text-sm mt-1">Make sure your Spotify Client ID is active.</p>
          </div>
        )
      )}
    </div>
  );
};

export default Search;