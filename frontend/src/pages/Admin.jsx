import { useState } from "react";
import axios from "axios";
import { Upload, Music, Image as ImageIcon } from "lucide-react";

const Admin = () => {
  const [fileData, setFileData] = useState({ title: "", artist: "", audio: null, image: null });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!fileData.audio || !fileData.image) {
        setStatus("Please select both audio and image files! ⚠️");
        return;
    }

    setLoading(true);
    setStatus("Uploading to Cloudinary... 🚀");

    const data = new FormData();
    data.append("title", fileData.title);
    data.append("artist", fileData.artist);
    data.append("audio", fileData.audio);
    data.append("image", fileData.image);

    try {
      const response = await axios.post("http://localhost:5000/api/admin/upload", data);
      console.log("Upload Success:", response.data);
      setStatus("Upload Successful! ✅");
      
      // Reset form
      setFileData({ title: "", artist: "", audio: null, image: null });
    } catch (err) {
      // Use the 'err' variable to provide specific feedback
      console.error("Upload Error Details:", err);
      const errorMessage = err.response?.data?.message || "Upload Failed! ❌";
      setStatus(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
        <Upload className="text-[#1DB954]" /> Admin Dashboard
      </h1>

      <form onSubmit={handleUpload} className="space-y-6 bg-[#181818] p-8 rounded-xl border border-[#282828] shadow-2xl">
        {/* Song Title Input */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300">Song Title</label>
          <input 
            type="text" 
            required
            placeholder="What's the track called?"
            className="w-full bg-[#242424] p-3 rounded-md outline-none text-white focus:ring-1 ring-[#1DB954] transition"
            value={fileData.title} 
            onChange={(e) => setFileData({...fileData, title: e.target.value})}
          />
        </div>

        {/* Artist Name Input */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-300">Artist Name</label>
          <input 
            type="text" 
            required
            placeholder="Who sang this?"
            className="w-full bg-[#242424] p-3 rounded-md outline-none text-white focus:ring-1 ring-[#1DB954] transition"
            value={fileData.artist} 
            onChange={(e) => setFileData({...fileData, artist: e.target.value})}
          />
        </div>

        {/* File Upload Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Audio Upload */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#333] p-6 rounded-lg cursor-pointer hover:bg-[#222] hover:border-[#1DB954] transition group">
            <Music className="mb-2 text-gray-400 group-hover:text-[#1DB954]" />
            <span className="text-xs text-gray-400 font-medium">Audio File (MP3/WAV)</span>
            <input 
                type="file" 
                accept="audio/*" 
                className="hidden" 
                onChange={(e) => setFileData({...fileData, audio: e.target.files[0]})} 
            />
            {fileData.audio && (
                <p className="text-[10px] mt-2 text-[#1DB954] font-bold truncate max-w-full">
                    🎵 {fileData.audio.name}
                </p>
            )}
          </label>

          {/* Image Upload */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#333] p-6 rounded-lg cursor-pointer hover:bg-[#222] hover:border-[#1DB954] transition group">
            <ImageIcon className="mb-2 text-gray-400 group-hover:text-[#1DB954]" />
            <span className="text-xs text-gray-400 font-medium">Cover Image (JPG/PNG)</span>
            <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => setFileData({...fileData, image: e.target.files[0]})} 
            />
            {fileData.image && (
                <p className="text-[10px] mt-2 text-[#1DB954] font-bold truncate max-w-full">
                    🖼️ {fileData.image.name}
                </p>
            )}
          </label>
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-[#1DB954] text-black font-bold py-3 rounded-full hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Processing...
            </span>
          ) : "Publish Song"}
        </button>

        {/* Status Message */}
        {status && (
            <div className={`text-center text-sm font-semibold p-2 rounded-md ${status.includes('✅') ? 'text-[#1DB954] bg-[#1db954]/10' : 'text-red-500 bg-red-500/10'}`}>
                {status}
            </div>
        )}
      </form>
    </div>
  );
};

export default Admin;