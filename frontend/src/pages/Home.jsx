import { useEffect, useState } from "react";
import axios from "axios";
import SongCard from "../components/SongCard";
import CategoryBar from "../components/CategoryBar";
import { useAuthStore } from "../store/useAuthStore";
import { 
  Music2, Sparkles, Clock, Flame, Loader2, 
  Home as HomeIcon, Search as SearchIcon, 
  Download, Bell, Box 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Spotify Credentials
const CLIENT_ID = '1fefe49b3f574e719540fdcabee4605b';
const CLIENT_SECRET = 'd85a039f991f4b7f9fbf4c5827876ce7';

const Home = () => {
  const [localSongs, setLocalSongs] = useState([]);
  const [spotifySongs, setSpotifySongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { user } = useAuthStore();
  
  // 🔥 FIXED: navigate is now being used below in the onClick handlers
  const navigate = useNavigate();

  // 1. Helper to get Spotify Token
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
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Spotify Auth Error:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const localUrl = selectedCategory === "All" 
          ? "http://localhost:5000/api/songs" 
          : `http://localhost:5000/api/songs?genre=${selectedCategory}`;
        const localRes = await axios.get(localUrl).catch(() => ({ data: [] }));
        setLocalSongs(localRes.data);

        const token = await getSpotifyToken();
        if (token) {
          const query = selectedCategory === "All" ? "trending 2026" : selectedCategory;
          const spotifyRes = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10&market=US`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const spotifyData = await spotifyRes.json();
          
          if (spotifyData.tracks) {
            const formatted = spotifyData.tracks.items.map(track => ({
              _id: track.id,
              title: track.name,
              artist: track.artists[0].name,
              imageUrl: track.album.images[0]?.url,
              audioUrl: track.preview_url,
              album: track.album.name,
              isSpotifyTrack: true
            }));
            setSpotifySongs(formatted);
          }
        }
      } catch (err) {
        console.error("Combined Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  return (
    <div className="relative min-h-full bg-black overflow-y-auto scroll-smooth custom-scrollbar text-white">
      
      {/* 🚀 TOP SPOTIFY NAVIGATION BAR */}
      <nav className="sticky top-0 z-[100] bg-black px-4 py-2 flex items-center justify-between gap-4">
        {/* Left: Spotify Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.302c-.223.367-.704.484-1.071.261-2.973-1.819-6.716-2.23-11.125-1.222-.419.096-.841-.172-.937-.591-.097-.419.172-.841.591-.937 4.832-1.106 8.973-.633 12.28 1.42.368.223.485.704.262 1.07zm1.47-3.256c-.281.455-.877.6-1.332.32-3.404-2.093-8.591-2.704-12.613-1.482-.511.155-1.05-.139-1.205-.65-.155-.511.139-1.05.65-1.205 4.595-1.396 10.314-.72 14.18 1.657.456.28.6.877.32 1.36zm.135-3.39c-4.085-2.427-10.82-2.651-14.733-1.464-.626.19-1.285-.16-1.475-.787-.19-.626.16-1.285.787-1.475 4.498-1.365 11.944-1.1 16.657 1.697.562.333.751 1.058.418 1.62-.333.562-1.058.751-1.62.418z"/>
            </svg>
        </div>

        {/* Center: Home and Search Bar */}
        <div className="flex flex-1 max-w-2xl items-center gap-2">
            <button 
              onClick={() => navigate("/")}
              className="p-3 bg-[#1f1f1f] rounded-full hover:scale-105 transition-all"
            >
                <HomeIcon size={24} className="text-white" />
            </button>

            <div 
              className="relative flex-1 group cursor-text"
              onClick={() => navigate("/search")} // 🔥 Using navigate here!
            >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors">
                    <SearchIcon size={20} />
                </div>
                <input 
                    type="text"
                    readOnly
                    placeholder="What do you want to play?"
                    className="w-full bg-[#1f1f1f] cursor-pointer hover:bg-[#2a2a2a] border border-transparent rounded-full py-3 pl-12 pr-12 text-sm outline-none transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 border-l border-gray-600 pl-3 hover:text-white">
                    <Box size={20} />
                </div>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
            <button className="hidden md:block bg-white text-black font-bold text-sm px-4 py-2 rounded-full hover:scale-105 transition-all">
                Explore Premium
            </button>
            
            <button className="flex items-center gap-1.5 text-sm font-bold hover:scale-105 transition-all">
                <div className="border border-white/40 rounded-full p-0.5">
                    <Download size={14} />
                </div>
                <span>Install App</span>
            </button>

            <button className="text-gray-400 hover:text-white transition-all">
                <Bell size={20} />
            </button>

            <div className="h-8 w-8 bg-pink-500 rounded-full flex items-center justify-center text-black font-bold text-xs cursor-pointer hover:scale-105 transition-all border-2 border-black ring-1 ring-white/10">
                {user?.username?.[0].toUpperCase() || 'A'}
            </div>
        </div>
      </nav>

      {/* 🎭 Background Effect */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none">
        <div className="absolute -top-[150px] -left-[100px] w-[600px] h-[600px] bg-[#1DB954]/10 rounded-full blur-[140px] animate-pulse" />
      </div>

      <div className="relative p-6 lg:p-10 z-10">
        <header className="mb-12">
          <div className="mb-10">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter">
              {user ? `Welcome back, ${user.username}` : "Good evening"}
            </h1>
          </div>

          <div className="sticky top-16 z-50 py-4 mb-8">
            <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          </div>
        </header>

        {/* 🚀 Featured Mixes */}
        {selectedCategory === "All" && (
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[
                 { title: "On Repeat", color: "from-purple-600 to-blue-500", icon: <Flame fill="white"/> },
                 { title: "Trending Global", color: "from-[#1DB954] to-emerald-800", icon: <Sparkles fill="white"/> },
                 { title: "New For You", color: "from-orange-500 to-red-600", icon: <Music2 /> }
               ].map((box, i) => (
                <div key={i} className="bg-[#1f1f1f]/60 hover:bg-[#2a2a2a] transition-all p-4 rounded-md flex items-center gap-4 cursor-pointer group">
                    <div className={`w-12 h-12 bg-gradient-to-br ${box.color} rounded shadow-lg flex items-center justify-center text-white`}>
                        {box.icon}
                    </div>
                    <p className="text-white font-bold">{box.title}</p>
                </div>
               ))}
            </div>
          </section>
        )}

        {/* 🎵 Spotify Global Hits */}
        {!loading && spotifySongs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black mb-6">Global Trending</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {spotifySongs.map((song) => (
                <SongCard key={song._id} song={song} allSongs={[...localSongs, ...spotifySongs]} />
              ))}
            </div>
          </section>
        )}

        {/* 🏠 Your Library */}
        <section className="pb-32">
          <h2 className="text-2xl font-black mb-6">Your Library</h2>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#1DB954]" size={40} /></div>
          ) : localSongs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {localSongs.map((song) => (
                <SongCard key={song._id} song={song} allSongs={localSongs} />
              ))}
            </div>
          ) : (
            <div className="p-10 bg-[#1f1f1f] rounded-xl text-center text-gray-400">
              No local tracks found.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;