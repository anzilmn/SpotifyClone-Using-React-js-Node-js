import express from "express";
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";

const router = express.Router();

// TOGGLE LIKE/UNLIKE
router.post("/like/:songId", async (req, res) => {
    try {
        const { userId } = req.body; 
        const { songId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isLiked = user.likedSongs.includes(songId);

        if (isLiked) {
            // Remove from array
            user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId);
        } else {
            // Add to array
            user.likedSongs.push(songId);
        }

        await user.save();
        res.json({ likedSongs: user.likedSongs, isLiked: !isLiked });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET FULL LIKED SONGS DATA (For Library Page)
router.get("/liked-songs/:userId", async (req, res) => {
    try {
        // .populate('likedSongs') swaps IDs for the actual Song objects
        const user = await User.findById(req.params.userId).populate("likedSongs");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.likedSongs); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;