import { useState, useEffect } from "react";

const Album = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      {favorites.map((img, index) => (
        <img key={index} src={img} className="h-28 w-28 object-cover" />
      ))}
    </div>
  );
};

export default Album;
