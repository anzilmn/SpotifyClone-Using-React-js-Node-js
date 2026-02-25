import express from "express";

const router = express.Router();

// This is a placeholder route so your server doesn't crash
router.get("/", (req, res) => {
    res.json({ message: "Playlist route working!" });
});

export default router;