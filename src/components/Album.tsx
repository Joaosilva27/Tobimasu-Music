interface AlbumProps {
  favorites: string[];
  onRemove: (coverUrl: string) => void;
}

const Album = ({ favorites, onRemove }: AlbumProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {favorites.map((img, index) => (
        <div
          key={index}
          className="relative w-32 h-32 hover:animate-spin cursor-pointer"
          onClick={() => onRemove(img)}
        >
          {/* vinyl base */}
          <div className="absolute inset-0 rounded-full bg-black flex items-center justify-center">
            {/* vinyl grooves */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(255,255,255,0.1)_40%,_rgba(255,255,255,0.1)_45%,_transparent_45%)]"></div>

            {/* center */}
            <div className="relative w-18 h-18 rounded-full bg-white overflow-hidden">
              <img
                src={img}
                className="w-full h-full object-cover"
                alt="Album cover"
              />
            </div>

            {/* center hole */}
            <div className="absolute w-2 h-2 rounded-full bg-gray-800"></div>
          </div>

          {/* reflection */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-white/10 to-transparent rounded-full mix-blend-overlay"></div>
        </div>
      ))}
    </div>
  );
};

export default Album;
