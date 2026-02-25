import { useParams, useNavigate } from "react-router-dom";
import { usePlayerStore } from "../store/usePlayerStore";
import { Clock, Play, MoreHorizontal, Music, Trash2 } from "lucide-react";

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Removed isPlaying to fix the ESLint error
  const { playlists, playPlaylist, currentSong, deletePlaylist } = usePlayerStore();

  // Find the specific playlist
 const playlist = playlists.find((p) => String(p.id) === String(id));  

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${playlist?.name}"?`)) {
      deletePlaylist(id);
      navigate("/"); // Go back to home after deleting
    }
  };

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <p className="text-xl font-bold">Playlist not found</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 text-[#1DB954] hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-[#4a4a4a] to-[#121212]">
      {/* Header Section */}
      <div className="flex items-end gap-6 p-8 pb-6 bg-gradient-to-b from-transparent to-black/20">
        <div className="w-52 h-52 bg-[#282828] shadow-2xl flex items-center justify-center rounded-lg overflow-hidden">
          {playlist.songs?.[0]?.imageUrl ? (
            <img 
              src={playlist.songs[0].imageUrl} 
              alt={playlist.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Music size={80} className="text-gray-500" />
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold uppercase tracking-wider">Playlist</span>
          <h1 className="text-5xl md:text-7xl font-black">{playlist.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm font-medium">
            <span className="hover:underline cursor-pointer">Your Library</span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span className="text-gray-300">{playlist.songs?.length || 0} songs</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-8 flex items-center gap-8">
        {/* Play Button */}
        <button 
          onClick={() => playlist.songs?.length > 0 && playPlaylist(playlist)}
          disabled={!playlist.songs?.length}
          className={`w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 transition active:scale-95 shadow-lg ${!playlist.songs?.length && 'opacity-50 cursor-not-allowed'}`}
        >
          <Play size={28} fill="black" className="text-black ml-1" />
        </button>

        {/* Delete Button */}
        <button 
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Playlist"
        >
          <Trash2 size={28} />
        </button>

        <button className="text-gray-400 hover:text-white transition">
          <MoreHorizontal size={32} />
        </button>
      </div>

      {/* Song List Table */}
      <div className="px-8 pb-12">
        <div className="grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 text-gray-400 border-b border-white/10 text-xs font-bold uppercase tracking-widest mb-4">
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <div className="flex justify-end pr-8">
            <Clock size={16} />
          </div>
        </div>

        {playlist.songs?.length > 0 ? (
          playlist.songs.map((song, index) => (
            <div 
              key={song.id || index}
              onClick={() => playPlaylist(playlist, index)}
              className="grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 rounded-md hover:bg-white/10 transition group cursor-pointer items-center"
            >
              <span className="text-gray-400 group-hover:text-white text-sm">
                {index + 1}
              </span>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#282828] rounded shrink-0 overflow-hidden">
                   {song.imageUrl && <img src={song.imageUrl} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="flex flex-col truncate">
                  <span className={`text-sm font-medium truncate ${currentSong?.id === song.id ? 'text-[#1DB954]' : 'text-white'}`}>
                    {song.title}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-white truncate">
                    {song.artist}
                  </span>
                </div>
              </div>

              <span className="text-sm text-gray-400 group-hover:text-white truncate">
                {song.album || "Single"}
              </span>

              <div className="flex justify-end pr-8 text-sm text-gray-400 group-hover:text-white">
                {song.duration || "0:00"}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">This playlist is currently empty.</p>
            <p className="text-sm">Add some songs to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;