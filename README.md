# 🎧 Spotify Premium Clone - Full Stack MERN Application

A high-fidelity, performance-optimized Spotify clone built using the **MERN stack** (MongoDB, Express, React, Node.js). This application features a hybrid data-fetching system that integrates a local backend with the **Spotify Web API** to deliver a "Premium" music streaming experience.



## 🚀 Key Features

* **Hybrid Data Engine:** Seamlessly fetches user-uploaded tracks from a local MongoDB database while simultaneously pulling global trending hits via the **Spotify API**.
* **Spotify-Standard UI:** Implements a pixel-perfect navigation system, including a glassmorphic top bar, circular Home/Search controls, and an adaptive "Premium" theme.
* **Real-Time API Integration:** Leverages **OAuth 2.0** (Client Credentials Flow) to fetch live metadata, album art, and track previews from Spotify's global servers.
* **Dynamic UX:** Features a debounced search interface, sticky category filters, and animated ambient backgrounds for a polished desktop-app feel.
* **Responsive Grid:** Fully optimized layout using Tailwind CSS for fluid transitions and a consistent experience across different screen sizes.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Lucide Icons, React Router.
* **Backend:** Node.js, Express.js, Axios.
* **Database:** MongoDB (Mongoose ODM).
* **Authentication/State:** Custom AuthStore for session management and user personalization.
* **API:** Spotify Web API.

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/spotify-clone.git](https://github.com/yourusername/spotify-clone.git)
    cd spotify-clone
    ```

2.  **Install Dependencies:**
    ```bash
    # Install for Client
    cd client && npm install
    
    # Install for Server
    cd ../server && npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the server directory and add:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    ```

4.  **Run the Application:**
    ```bash
    # From the root directory
    npm run dev
    ```

## 📸 Screenshots

| Desktop View | Search Interface |
| :--- | :--- |
| ![Home Page](https://via.placeholder.com/400x250?text=Home+Page+UI) | ![Search UI](https://via.placeholder.com/400x250?text=Search+Interface+UI) |

## 🛡️ Future Enhancements
- [ ] Add real-time music playback using Spotify SDK.
- [ ] Implement "Like" functionality and custom user playlists.
- [ ] Social features: See what friends are listening to.

---
Developed with 💚 by [Your Name]
