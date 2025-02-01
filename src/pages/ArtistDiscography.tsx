import axios from "axios";
import { useState } from "react";
import { useParams, Link } from "react-router";
import { useEffect } from "react";

const ArtistDiscography = () => {
  const { artistName } = useParams();
  const [artistProfilePicture, setArtistProfilePicture] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<boolean>(false);

  const [artistAlbums, setArtistAlbums] = useState<{ [key: string]: any[] }>(
    {}
  );

  const addToFavorites = (coverUrl: string) => {
    const currentFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    localStorage.setItem(
      "favorites",
      JSON.stringify([...currentFavorites, coverUrl])
    );
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("backgroundColor");
    if (savedColor) setBackgroundColor(JSON.parse(savedColor));
  }, []);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const artistRes = await axios.get(
          `https://api.deezer.com/search/artist?q=${artistName}`
        );
        const artistData = artistRes.data.data[0];

        // get artist albums
        const albumsRes = await axios.get(
          `https://api.deezer.com/artist/${artistData.id}/albums?limit=`
        );

        setArtistAlbums({ [artistData.id]: albumsRes.data.data });
        setArtistProfilePicture(artistData.picture_medium);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (artistName) fetchArtist();
  }, [artistName]);

  return (
    <div className="h-screen">
      <div
        className={
          backgroundColor
            ? "bg-beige min-h-screen p-7"
            : "pallete-color_background text-beige min-h-screen p-7"
        }
      >
        <div className="flex justify-center items-center">
          <div>
            {artistProfilePicture && (
              <div className="relative mb-10">
                <Link to="/" className="absolute left-0 top-0 mt-4 ml-4">
                  ← Go back
                </Link>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <img
                      className="h-30 w-30 rounded-xl"
                      src={artistProfilePicture}
                    />
                    <h2 className="font-bold text-3xl ml-4">{artistName}</h2>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-center flex-wrap">
              {Object.values(artistAlbums)
                .flat()
                .map((album) => (
                  <div
                    key={album.id}
                    className="group relative flex flex-col items-center"
                  >
                    <div className="relative group">
                      <img
                        src={album.cover_medium}
                        alt={album.title}
                        className="w-32 h-32 object-cover rounded shadow transition-all duration-300 group-hover:blur-xs"
                      />

                      <div
                        onClick={() => addToFavorites(album.cover_medium)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
                      >
                        <span className="text-white font-bold text-sm">
                          FAVORITE ❤️
                        </span>
                      </div>
                    </div>

                    <span className="mt-2 text-sm text-center font-medium max-w-35">
                      {album.title}
                    </span>
                  </div>
                ))}
              {Object.keys(artistAlbums).length === 0 && (
                <div className="text-gray-500">Loading albums...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDiscography;
