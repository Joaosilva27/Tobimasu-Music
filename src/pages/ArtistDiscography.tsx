import axios from "axios";
import { useState } from "react";
import { useParams, Link } from "react-router";
import { useEffect } from "react";

const ArtistDiscography = () => {
  const { artistName } = useParams();
  const [artistProfilePicture, setArtistProfilePicture] = useState<string>("");
  const [artistResultList, setArtistResultList] = useState<Array<any>>([]);
  const [artistAlbums, setArtistAlbums] = useState<{ [key: string]: any[] }>(
    {}
  );

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const artistRes = await axios.get(
          `https://api.deezer.com/search/artist?q=${artistName}`
        );
        const artistData = artistRes.data.data[0];

        // Get artist albums
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
    <div>
      <div className="flex justify-center mt-5 items-center">
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
                <div key={album.id} className="flex flex-col items-center">
                  <img
                    src={album.cover_medium}
                    alt={album.title}
                    className="w-32 h-32 object-cover rounded shadow"
                  />
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
  );
};

export default ArtistDiscography;
