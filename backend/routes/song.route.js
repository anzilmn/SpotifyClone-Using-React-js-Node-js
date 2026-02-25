import express from "express";
import axios from "axios";
import { Song } from "../models/song.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { genre } = req.query;
    
    // 🔥 ULTRA POWER: Smart Search Logic
    let searchQuery;
    if (!genre || genre === "All") {
      searchQuery = "top 50 global";
    } else if (["Malayalam", "Hindi", "Tamil", "Telugu", "English", "Spanish", "K-Pop"].includes(genre)) {
      // If it's a language, search for top hits in that language
      searchQuery = `${genre} top hits 2024`;
    } else {
      searchQuery = genre;
    }

    // 1. Fetch custom songs from MongoDB
    const mySongs = await Song.find().sort({ createdAt: -1 });

    // 2. Fetch Dynamic Category from Deezer
    const options = {
      method: 'GET',
      url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
      params: { q: searchQuery }, 
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
      }
    };

    const deezerRes = await axios.request(options);
    
    // 3. Transform API data
    const apiSongs = deezerRes.data.data.map(track => ({
      _id: `deezer-${track.id}`,
      title: track.title,
      artist: track.artist.name,
      imageUrl: track.album.cover_big, 
      audioUrl: track.preview,
      duration: track.duration,
      isApi: true
    }));

    // 4. Combine: Local uploads first
    res.json([...mySongs, ...apiSongs]);

  } catch (err) {
    console.error("Fetch Error:", err.message);
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const songs = await Song.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { artist: { $regex: query, $options: "i" } },
      ],
    });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;