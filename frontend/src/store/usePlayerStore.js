import { create } from "zustand";

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  playlists: JSON.parse(localStorage.getItem("playlists")) || [],

  createPlaylist: (name) => {
    // Force ID to string to ensure it matches React Router params perfectly
    const newPlaylist = { id: Date.now().toString(), name, songs: [] };
    const updated = [...get().playlists, newPlaylist];
    set({ playlists: updated });
    localStorage.setItem("playlists", JSON.stringify(updated));
  },

  deletePlaylist: (playlistId) => {
    // Ensure we compare strings to avoid type mismatch
    const updated = get().playlists.filter((p) => String(p.id) !== String(playlistId));
    set({ playlists: updated });
    localStorage.setItem("playlists", JSON.stringify(updated));
  },

  playPlaylist: (playlist, startIndex = 0) => {
    if (!playlist.songs || playlist.songs.length === 0) return;
    set({
      queue: playlist.songs,
      currentSong: playlist.songs[startIndex],
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  addSongToPlaylist: (playlistId, song) => {
    const { playlists } = get();
    const updatedPlaylists = playlists.map((pl) => {
      if (String(pl.id) === String(playlistId)) {
        const exists = pl.songs.find((s) => s._id === song._id);
        if (exists) {
          alert("Song already in playlist!");
          return pl;
        }
        return { ...pl, songs: [...pl.songs, song] };
      }
      return pl;
    });

    set({ playlists: updatedPlaylists });
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    alert(`Added ${song.title} to playlist!`);
  },

  importPlaylist: (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        const updated = [
          ...get().playlists,
          { ...imported, id: Date.now().toString() },
        ];
        set({ playlists: updated });
        localStorage.setItem("playlists", JSON.stringify(updated));
        alert("Playlist Imported Successfully!");
      } catch {
        // Removed the unused 'err' variable to fix ESLint warning
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  },

  exportPlaylist: (playlist) => {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(playlist));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${playlist.name}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error("Export failed", error);
    }
  },

  setCurrentSong: (song, songs = []) => {
    const index = songs.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      queue: songs.length > 0 ? songs : get().queue,
      currentIndex: index !== -1 ? index : 0,
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  updateProgress: (currentTime, duration) => set({ currentTime, duration }),
  setVolume: (value) => {
    if (window.audioElement) window.audioElement.volume = value;
    set({ volume: value });
  },
  seek: (time) => {
    if (window.audioElement) window.audioElement.currentTime = time;
    set({ currentTime: time });
  },
  playNext: () => {
    const { currentIndex, queue } = get();
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    set({
      currentSong: queue[nextIndex],
      currentIndex: nextIndex,
      isPlaying: true,
    });
  },
  playPrevious: () => {
    const { currentIndex, queue } = get();
    if (queue.length === 0) return;
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    set({
      currentSong: queue[prevIndex],
      currentIndex: prevIndex,
      isPlaying: true,
    });
  },
}));