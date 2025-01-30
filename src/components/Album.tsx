import React from "react";
import { useEffect } from "react";

interface AlbumProps {
  image: string;
}

const Album = ({ image }: AlbumProps) => {
  return (
    <div>
      <div id="favorite-container">
        <div className="border-2 h-28 w-28">
          <img src={image} alt="Album cover" />
        </div>
      </div>
    </div>
  );
};

export default Album;
