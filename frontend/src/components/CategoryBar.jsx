const categories = [
  "All", 
 
  "Pop", 
  "Rock", 
  "Hip-Hop", 
  "Lofi", 
  "Jazz", 
   "Malayalam", 
  "Hindi", 
  "English", 
  "Tamil", 
  "Telugu", 
  "Spanish",
  "K-Pop",
];

const CategoryBar = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide touch-pan-x">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap border ${
            selectedCategory === cat 
            ? "bg-white text-black border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
            : "bg-[#121212] text-white border-white/10 hover:bg-[#282828] hover:border-white/20"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;