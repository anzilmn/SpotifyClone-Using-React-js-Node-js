import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from "lucide-react";
import { usePlayerStore } from "../store/usePlayerStore";

const PlayerBar = () => {
  const { 
    currentSong, isPlaying, togglePlay, playNext, playPrevious,
    currentTime, duration, seek, volume, setVolume 
  } = usePlayerStore();

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentSong) return null;

  return (
    <footer className="h-20 bg-black border-t border-[#282828] px-4 flex items-center justify-between fixed bottom-0 w-full z-50">
      
      {/* 1. Song Info */}
      <div className="flex items-center gap-4 w-[30%]">
        <img src={currentSong.imageUrl} alt="cover" className="h-14 w-14 rounded-md object-cover" />
        <div className="max-w-[180px]">
          <h4 className="text-sm font-semibold truncate text-white">{currentSong.title}</h4>
          <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
        </div>
      </div>

      {/* 2. Controls & Seek Bar */}
      <div className="flex flex-col items-center max-w-[40%] w-full gap-2">
        <div className="flex items-center gap-6 text-gray-400">
          <Shuffle size={18} className="hover:text-white cursor-pointer" />
          <SkipBack onClick={playPrevious} size={24} className="hover:text-white cursor-pointer" />
          <button onClick={togglePlay} className="bg-white p-2 rounded-full text-black hover:scale-105 transition">
            {isPlaying ? <Pause fill="black" size={20} /> : <Play fill="black" size={20} />}
          </button>
          <SkipForward onClick={playNext} size={24} className="hover:text-white cursor-pointer" />
          <Repeat size={18} className="hover:text-white cursor-pointer" />
        </div>
        
        {/* Real Seek Bar */}
        <div className="w-full flex items-center gap-2 group">
           <span className="text-[10px] text-gray-400 min-w-[30px] text-right">{formatTime(currentTime)}</span>
           <input 
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 h-1 bg-[#4d4d4d] appearance-none rounded-full cursor-pointer accent-white hover:accent-[#1DB954]"
           />
           <span className="text-[10px] text-gray-400 min-w-[30px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Volume Control */}
      <div className="w-[30%] flex justify-end items-center gap-3 text-gray-400">
        <Volume2 size={20} />
        <input 
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 bg-[#4d4d4d] appearance-none rounded-full cursor-pointer accent-white hover:accent-[#1DB954]"
        />
      </div>
    </footer>
  );
};

export default PlayerBar;