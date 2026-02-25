import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import userRoutes from "./routes/user.route.js"; // 👈 1. Import it
import playlistRoutes from "./routes/playlist.route.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); 

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/users", userRoutes); // 👈 2. Use it (Best practice to use /api/users)
app.use("/api/playlists", playlistRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});