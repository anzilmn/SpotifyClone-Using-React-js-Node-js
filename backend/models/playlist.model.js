import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [{
        _id: String,
        title: String,
        artist: String,
        imageUrl: String,
        audioUrl: String,
        isApi: Boolean
    }]
}, { timestamps: true });

export const Playlist = mongoose.model("Playlist", playlistSchema);