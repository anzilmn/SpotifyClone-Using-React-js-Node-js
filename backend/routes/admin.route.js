import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { Song } from "../models/song.model.js";

const router = express.Router();

// Temporary storage for the file before uploading to Cloud
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/upload", upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    // Upload Audio to Cloudinary
    const audioRes = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video", // Cloudinary treats audio as video resource
      folder: "spotify_songs"
    });

    // Upload Image to Cloudinary
    const imageRes = await cloudinary.uploader.upload(imageFile.path, {
      folder: "spotify_covers"
    });

    // Save to MongoDB
    const newSong = new Song({
      title: req.body.title,
      artist: req.body.artist,
      audioUrl: audioRes.secure_url,
      imageUrl: imageRes.secure_url,
      duration: audioRes.duration, // Cloudinary gives us the length!
    });

    await newSong.save();
    res.status(201).json({ message: "Song uploaded successfully!", song: newSong });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;