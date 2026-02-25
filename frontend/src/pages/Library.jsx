import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import SongCard from "../components/SongCard";
import { Heart, Music } from "lucide-react";

const Library = () => {
  const { user } = useAuthStore();
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (!user || !user.id) return;
      try {
        // Updated to use the userId in the URL for clarity
        const res = await axios.get(`http://localhost:5000/api/users/liked-songs/${user.id}`);
        setLikedSongs(res.data);
      } catch (err) {
        console.error("Error fetching liked songs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-10">
        <div className="bg-[#282828] p-8 rounded-full">
            <Music size={64} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold">Log in to see your library</h2>
        <p className="text-gray-400 max-w-sm">Your favorite songs, albums, and playlists will show up here.</p>
      </div>
    );
  }

  return (
    <div className="p-8 h-full">
      {/* Header with Spotify Gradient Look */}
      <div className="flex flex-col md:flex-row items-end gap-6 mb-8 bg-gradient-to-b from-purple-800/40 to-transparent p-6 rounded-lg">
        <div className="w-52 h-52 bg-gradient-to-br from-indigo-700 to-purple-400 shadow-2xl flex items-center justify-center rounded-md shrink-0">
          <Heart fill="white" size={80} className="text-white" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wider">Playlist</p>
          <h1 className="text-5xl md:text-7xl font-black mb-2">Liked Songs</h1>
          <div className="flex items-center gap-2">
             <span className="font-bold text-sm hover:underline cursor-pointer">{user.username}</span>
             <span className="text-gray-300 text-sm">• {likedSongs.length} songs</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DB954]"></div>
        </div>
      ) : likedSongs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {likedSongs.map((song) => (
            <SongCard key={song._id} song={song} allSongs={likedSongs} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121212] rounded-xl border border-[#282828]">
          <p className="text-gray-400 text-lg">Your library is empty. Go heart some tracks!</p>
        </div>
      )}
    </div>
  );
};

export default Library;