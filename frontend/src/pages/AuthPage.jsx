import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Chrome, Facebook, Github } from "lucide-react"; // Icons for social buttons

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      setAuth(res.data.user, res.data.token);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  // Helper for Social Buttons (Visual only for now)
  const handleSocialLogin = (platform) => {
    console.log(`${platform} login coming soon!`);
    alert(`${platform} integration requires Firebase or OAuth setup on the backend.`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-sans">
      {/* 🟢 Premium Logo Section */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="black">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.491 17.306c-.215.353-.675.464-1.027.249-2.813-1.718-6.353-2.107-10.521-1.154-.403.092-.806-.16-.898-.563-.092-.404.16-.807.563-.899 4.557-1.042 8.454-.602 11.614 1.339.352.215.464.675.249 1.028zm1.467-3.26c-.271.442-.847.585-1.289.314-3.22-1.979-8.128-2.553-11.937-1.397-.497.151-1.025-.132-1.176-.63-.151-.497.132-1.025.63-1.176 4.354-1.321 9.773-.675 13.47 1.599.442.271.585.847.314 1.289zm.126-3.411c-3.863-2.294-10.245-2.506-13.916-1.391-.593.18-1.222-.152-1.402-.745-.18-.593.152-1.222.745-1.402 4.223-1.282 11.272-1.036 15.711 1.6 0.534.317.708 1.005.392 1.539-.317.534-1.005.708-1.539.392z" />
          </svg>
        </div>
        <span className="text-3xl font-black tracking-tighter">Spotify</span>
      </div>

      <div className="w-full max-w-[450px] space-y-6">
        <h2 className="text-4xl font-black text-center mb-10 tracking-tight">
          {isLogin ? "Log in to Spotify" : "Sign up to start listening"}
        </h2>

        {/* 📱 Social Login Buttons */}
        <div className="space-y-3 mb-8">
          <button 
            onClick={() => handleSocialLogin("Google")}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-500 rounded-full font-bold hover:border-white transition-all bg-transparent"
          >
            <Chrome size={20} /> Continue with Google
          </button>
          <button 
            onClick={() => handleSocialLogin("Facebook")}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-500 rounded-full font-bold hover:border-white transition-all bg-transparent"
          >
            <Facebook size={20} className="fill-blue-600 text-blue-600" /> Continue with Facebook
          </button>
          <button 
             onClick={() => handleSocialLogin("Github")}
             className="w-full flex items-center justify-center gap-3 py-3 border border-gray-500 rounded-full font-bold hover:border-white transition-all bg-transparent"
          >
            <Github size={20} /> Continue with Github
          </button>
        </div>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-[#292929]"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-[#292929]"></div>
        </div>

        {/* 📝 Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="text-sm font-bold mb-2 block text-white">What should we call you?</label>
              <input
                type="text"
                required
                className="w-full bg-[#121212] border border-gray-500 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-white outline-none transition hover:border-white"
                placeholder="Enter a profile name"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-bold mb-2 block text-white">Email address</label>
            <input
              type="email"
              required
              className="w-full bg-[#121212] border border-gray-500 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-white outline-none transition hover:border-white"
              placeholder="Email address"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-bold mb-2 block text-white">Password</label>
            <input
              type="password"
              required
              className="w-full bg-[#121212] border border-gray-500 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-white outline-none transition hover:border-white"
              placeholder="Password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1DB954] text-black font-black py-4 rounded-full hover:scale-105 active:scale-95 transition-all mt-4 text-lg shadow-xl"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-[#292929]">
          <p className="text-gray-400 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-bold ml-2 underline hover:text-[#1DB954] transition decoration-1 underline-offset-4"
            >
              {isLogin ? "Sign up for Spotify" : "Log in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;