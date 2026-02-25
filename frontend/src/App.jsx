import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import Sidebar from "./components/Sidebar";
import PlayerBar from "./components/PlayerBar";
import AudioController from "./components/AudioController";
import Home from "./pages/Home";
import Search from "./pages/Search";
import AuthPage from "./pages/AuthPage";
import Library from "./pages/Library";
import Admin from "./pages/Admin";
import PlaylistPage from "./pages/PlaylistPage"; // 🚀 Import the new page

function App() {
  const { user } = useAuthStore();

  return (
    <div className="h-screen w-full flex flex-col bg-black text-white overflow-hidden font-sans">
      
      <AudioController />

      <div className="flex flex-1 overflow-hidden relative">
        
        {user && (
          <aside className="w-[280px] hidden md:flex flex-col p-2 pr-0">
            <Sidebar />
          </aside>
        )}

        <main 
          className={`flex-1 overflow-y-auto bg-[#121212] transition-all duration-500 ease-in-out relative
            ${user ? 'm-2 rounded-xl border border-white/5 shadow-2xl' : 'm-0'} 
            custom-scrollbar`}
        >
          <Routes>
            <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
            
            <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
            <Route path="/search" element={user ? <Search /> : <Navigate to="/auth" />} />
            <Route path="/library" element={user ? <Library /> : <Navigate to="/auth" />} />

            {/* 🎵 Playlist Route */}
            <Route path="/playlist/:id" element={user ? <PlaylistPage /> : <Navigate to="/auth" />} />

            {/* Admin Route check */}
            <Route 
              path="/admin" 
              element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />} 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>

      {user && (
        <footer className="h-[90px] w-full bg-black border-t border-white/5 px-4 z-50 flex-shrink-0">
           <PlayerBar />
        </footer>
      )}
    </div>
  );
}

export default App;