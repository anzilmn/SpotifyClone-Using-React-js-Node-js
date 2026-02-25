import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    audioUrl: { type: String, required: true }, // From Cloudinary
    imageUrl: { type: String, required: true }, // From Cloudinary
    duration: { type: Number, required: true },
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null }
}, { timestamps: true });

export const Song = mongoose.model("Song", songSchema);