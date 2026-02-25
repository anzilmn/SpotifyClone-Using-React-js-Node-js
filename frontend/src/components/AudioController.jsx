import { useEffect, useRef } from "react";
import { usePlayerStore } from "../store/usePlayerStore";

const AudioController = () => {
  const audioRef = useRef(new Audio());
  const { currentSong, isPlaying, playNext, updateProgress, volume } = usePlayerStore();

  // Attach ref to window so other components can trigger seek()
  useEffect(() => {
    window.audioElement = audioRef.current;
    audioRef.current.volume = volume;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      updateProgress(audio.currentTime, audio.duration);
    };

    const handleEnded = () => playNext();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playNext, updateProgress]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.log("Playback blocked:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentSong?.audioUrl) {
      audioRef.current.src = currentSong.audioUrl;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentSong]);

  return null;
};

export default AudioController;