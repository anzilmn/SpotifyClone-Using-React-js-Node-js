import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 🔥 ADMIN CHEAT CODE: Check if the email is the admin email
        const userRole = email === "admin@gmail.com" ? "admin" : "user";

        const user = await User.create({ 
            username, 
            email, 
            password: hashedPassword,
            role: userRole, // 👈 Assign the hardcoded role
            likedSongs: [] 
        });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ 
            token, 
            user: { 
                username: user.username, 
                id: user._id,
                email: user.email,
                role: user.role, // 👈 Send role to frontend
                likedSongs: user.likedSongs 
            } 
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: "Signup failed" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
            
            res.json({ 
                token, 
                user: { 
                    username: user.username, 
                    id: user._id,
                    email: user.email,
                    role: user.role, // 👈 Send the role back!
                    likedSongs: user.likedSongs || [] 
                } 
            });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

export default router;