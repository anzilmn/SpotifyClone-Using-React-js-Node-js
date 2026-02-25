import { Play, Heart, Plus, ListMusic } from "lucide-react";
import { usePlayerStore } from "../store/usePlayerStore";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import axios from "axios";

const SongCard = ({ song, allSongs }) => {
  const { setCurrentSong, currentSong, isPlaying, playlists, addSongToPlaylist } = usePlayerStore();
  const { user, toggleLike } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const isLiked = user?.likedSongs?.includes(song._id);
  const isCurrentPlaying = currentSong?._id === song._id;

  const handlePlay = () => setCurrentSong(song, allSongs);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      await axios.post(`http://localhost:5000/api/users/like/${song._id}`, { userId: user.id });
      toggleLike(song._id);
    } catch (err) {
      console.error("Error liking song", err);
    }
  };

  const handleAddToPlaylist = (e, playlistId) => {
    e.stopPropagation();
    addSongToPlaylist(playlistId, song);
    setShowDropdown(false);
  };

  return (
    <div 
      onClick={handlePlay}
      className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all group cursor-pointer relative"
    >
      <div className="relative aspect-square mb-4">
        <img src={song.imageUrl} alt={song.title} className="object-cover h-full w-full rounded-md shadow-lg" />
        
        {/* Play Button */}
        <div className={`absolute bottom-2 right-2 bg-[#1DB954] p-3 rounded-full shadow-2xl transition-all duration-300 ${
          isCurrentPlaying && isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
        }`}>
          <Play fill="black" className="text-black" size={24} />
        </div>

        {/* Top Icons Layer */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {/* Heart Icon */}
          {user && (
            <button 
              onClick={handleLike}
              className={`p-2 rounded-full bg-black/60 backdrop-blur-sm transition-opacity ${isLiked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            >
              <Heart size={16} fill={isLiked ? "#1DB954" : "none"} className={isLiked ? "text-[#1DB954]" : "text-gray-400"} />
            </button>
          )}

          {/* Plus / Playlist Icon */}
          {user && (
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                className="p-2 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              >
                <Plus size={16} className="text-gray-400 hover:text-white" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-10 w-48 bg-[#282828] border border-white/10 rounded-md shadow-2xl z-[100] py-1 animate-in fade-in zoom-in duration-200">
                  <p className="text-[10px] font-bold text-gray-400 px-3 py-1 border-b border-white/5 uppercase">Add to playlist</p>
                  {playlists.length === 0 ? (
                    <p className="text-[10px] text-gray-500 px-3 py-2">No playlists created</p>
                  ) : (
                    playlists.map((pl) => (
                      <button
                        key={pl.id}
                        onClick={(e) => handleAddToPlaylist(e, pl.id)}
                        className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-[#3e3e3e] flex items-center gap-2"
                      >
                        <ListMusic size={14} /> {pl.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className={`font-bold truncate ${isCurrentPlaying ? "text-[#1DB954]" : "text-white"}`}>{song.title}</h3>
        <p className="text-sm text-gray-400 truncate font-medium">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCard;