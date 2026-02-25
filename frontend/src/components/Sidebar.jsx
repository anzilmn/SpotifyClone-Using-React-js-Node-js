import { Home, Search, Library, Plus, LayoutDashboard, LogOut, Download, Upload, Heart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { usePlayerStore } from "../store/usePlayerStore";

const Sidebar = () => {
  const { user, setAuth } = useAuthStore();
  const { playlists, createPlaylist, exportPlaylist, importPlaylist } = usePlayerStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setAuth(null, null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const handleCreatePlaylist = () => {
    const name = prompt("Enter Playlist Name:");
    if (name && name.trim() !== "") {
      createPlaylist(name);
    }
  };

  const handleImportClick = () => {
    document.getElementById("import-json-input").click();
  };

  return (
    <div className="w-64 h-full bg-black flex flex-col gap-2 p-2 select-none">
      {/* 🏠 Navigation Section */}
      <div className="bg-[#121212] rounded-xl p-4 space-y-5">
        <Link 
          to="/" 
          className={`flex items-center gap-4 transition-all duration-300 group ${
            isActive("/") ? "text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          <Home size={26} fill={isActive("/") ? "currentColor" : "none"} /> 
          <span className="font-bold">Home</span>
        </Link>
        
        <Link 
          to="/search" 
          className={`flex items-center gap-4 transition-all duration-300 group ${
            isActive("/search") ? "text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          <Search size={26} strokeWidth={isActive("/search") ? 3 : 2} /> 
          <span className="font-bold">Search</span>
        </Link>

        {user?.role === "admin" && (
          <Link 
            to="/admin" 
            className={`flex items-center gap-4 transition-all duration-300 group border-t border-white/5 pt-4 ${
              isActive("/admin") ? "text-[#1DB954]" : "text-gray-400 hover:text-[#1DB954]"
            }`}
          >
            <LayoutDashboard size={26} /> 
            <span className="font-bold">Admin Panel</span>
          </Link>
        )}
      </div>

      {/* 📚 Library Section */}
      <div className="bg-[#121212] rounded-xl p-4 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between text-gray-400 mb-6 px-1">
          <Link 
            to="/library" 
            className={`flex items-center gap-2 font-bold hover:text-white transition-colors ${
              isActive("/library") ? "text-white" : ""
            }`}
          >
            <Library size={26} /> 
            <span>Your Library</span>
          </Link>
          <div className="flex gap-2">
            <input 
              type="file" 
              id="import-json-input" 
              hidden 
              accept=".json" 
              onChange={(e) => importPlaylist(e.target.files[0])} 
            />
            <button 
              onClick={handleImportClick} 
              className="p-1 hover:bg-[#282828] rounded-full transition text-gray-400 hover:text-white"
              title="Import Playlist JSON"
            >
              <Upload size={20} />
            </button>
            <button 
              onClick={handleCreatePlaylist}
              className="p-1 hover:bg-[#282828] rounded-full transition text-gray-400 hover:text-white"
              title="Create New Playlist"
            >
              <Plus size={22} />
            </button>
          </div>
        </div>

        {/* 💜 LIKED SONGS LINK */}
        <div className="mb-4">
          <Link 
            to="/library"
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group hover:bg-[#1a1a1a] ${
              isActive("/library") ? "bg-[#282828]" : ""
            }`}
          >
            <div className="w-10 h-10 rounded bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Heart size={18} fill="white" className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Liked Songs</span>
              <span className="text-[11px] text-gray-400 font-medium">
                Playlist • {user?.likedSongs?.length || 0} songs
              </span>
            </div>
          </Link>
        </div>

        {/* 🚀 Playlists Area - Now Clickable! */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
          {playlists.length === 0 ? (
            <div className="bg-[#242424] p-4 rounded-xl shadow-lg border border-white/5 space-y-4">
              <div>
                <p className="font-bold text-sm mb-1 text-white">Create your first playlist</p>
                <p className="text-xs text-gray-400">It's easy, we'll help you</p>
              </div>
              <button 
                onClick={handleCreatePlaylist}
                className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition active:scale-95"
              >
                Create playlist
              </button>
            </div>
          ) : (
            playlists.map((pl) => (
              <Link
                key={pl.id}
                to={`/playlist/${pl.id}`}
                className={`group flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                  isActive(`/playlist/${pl.id}`) ? "bg-[#282828]" : "hover:bg-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center text-gray-400 group-hover:bg-[#333] shrink-0">
                    <Library size={18} />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-bold text-white truncate">{pl.name}</span>
                    <span className="text-[11px] text-gray-400 font-medium">Playlist • {pl.songs?.length || 0} songs</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); // Prevent Link navigation when clicking download
                    e.stopPropagation(); 
                    exportPlaylist(pl); 
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-white transition"
                >
                  <Download size={18} />
                </button>
              </Link>
            ))
          )}
        </div>

        {/* 👤 User Section */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          {user && (
            <div className="flex items-center justify-between bg-[#1f1f1f] p-3 rounded-lg hover:bg-[#282828] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-[#1DB954] to-green-300 rounded-full flex items-center justify-center text-black font-black text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-white truncate max-w-[80px]">{user.username}</span>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          )}
          
          <button className="w-full border border-gray-500 text-white text-xs font-bold px-3 py-2 rounded-full hover:border-white transition flex items-center justify-center gap-2">
            🌐 English
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;