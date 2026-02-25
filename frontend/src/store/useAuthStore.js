    import { create } from "zustand";

    export const useAuthStore = create((set, get) => ({
        // Initialize state from localStorage
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,

        // Set user and token after Login/Signup
        setAuth: (user, token) => {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            set({ user, token });
        },

        // Clear everything on Logout
        logout: () => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            set({ user: null, token: null });
        },

        // 🔥 ULTRA POWER: Instant Like/Unlike Update
        toggleLike: (songId) => {
            const { user } = get();
            if (!user) return;

            const isLiked = user.likedSongs?.includes(songId);
            let updatedLikes;

            if (isLiked) {
                // Remove from list
                updatedLikes = user.likedSongs.filter((id) => id !== songId);
            } else {
                // Add to list (ensure likedSongs exists)
                updatedLikes = [...(user.likedSongs || []), songId];
            }

            const updatedUser = { ...user, likedSongs: updatedLikes };

            // Save to localStorage so it persists on refresh
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            // Update global state
            set({ user: updatedUser });
        }
    }));