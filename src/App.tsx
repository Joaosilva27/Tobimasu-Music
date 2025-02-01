import { useEffect, useState } from "react";
import axios from "axios";
import Album from "./components/Album";
import ArtistListResult from "./components/ArtistListResult";
import VinylIcon from "./icons/vinyl.png";
import { Link } from "react-router";

function App() {
  const [searchArtist, setSearchArtist] = useState<string>("");
  const [isUserSearching, setIsUserSearching] = useState<boolean>(false);
  const [currentlySearchingText, setCurrentlySearchingText] =
    useState<string>("");
  const [artistResultList, setArtistResultList] = useState<Array<any>>([]);
  const [artistAlbums, setArtistAlbums] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const onSearchForArtist = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .get(`https://api.deezer.com/search/artist?q=${searchArtist}`)
      .then((res) => {
        const data = res.data.data;
        setArtistResultList(data);
        setCurrentlySearchingText(searchArtist);
        setIsUserSearching(true);

        const albumPromises = data.map((artist: any) =>
          axios.get(`https://api.deezer.com/artist/${artist.id}/albums?limit=5`)
        );

        Promise.all(albumPromises)
          .then((responses) => {
            const albumsMap: { [key: string]: any[] } = {};
            responses.forEach((response, index) => {
              const artistId = data[index].id;
              albumsMap[artistId] = response.data.data;
            });
            setArtistAlbums(albumsMap);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });

    setSearchArtist("");
  };

  const removeFromFavorites = (coverUrl: string) => {
    const updatedFavorites = favorites.filter((url) => url !== coverUrl);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="flex flex-col min-h-screen p-20 pt-10">
      <div className="flex justify-center items-center gap-2 mb-14">
        <span className="text-2xl font-bold red-hat-display-900 text-black">
          tobimasu
        </span>
        <img className="h-10 w-10" src={VinylIcon} alt="Vinyl Icon" />
      </div>

      <div className="flex w-full justify-between gap-8">
        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            <form className="flex w-full" onSubmit={onSearchForArtist}>
              <input
                className="flex-1 p-2 border rounded"
                onChange={(e) => setSearchArtist(e.target.value)}
                placeholder="Search for an artist's name"
                value={searchArtist}
              />
              <button
                className="px-4 py-2 rounded ml-2 text-black pallete-color_background"
                type="submit"
              >
                SEARCH
              </button>
            </form>
          </div>

          {isUserSearching && (
            <div className="w-auto pallete-color">
              <span>
                You are currently searching for:{" "}
                <span className="font-bold red-hat-display-900 capitalize">
                  {currentlySearchingText}
                </span>
              </span>
              {artistResultList.map((artist: any) => (
                <div
                  key={artist.id}
                  className="mb-6 p-4 pallete-color rounded border-solid border-1"
                >
                  <Link to={`/artist/${artist.name}`}>
                    <ArtistListResult
                      name={artist.name}
                      profilePicture={artist.picture_medium}
                    />
                  </Link>

                  <div className="mt-3 ">
                    <h4 className="font-semibold mb-2">Top Albums:</h4>
                    <div className="flex gap-3 justify-center">
                      {artistAlbums[artist.id]?.slice(0, 5).map((album) => (
                        <div
                          key={album.id}
                          className="flex flex-col items-center"
                        >
                          <img
                            src={album.cover_medium}
                            alt={album.title}
                            className="w-32 h-32 object-cover rounded shadow"
                          />
                          <span className="mt-2 text-sm text-center font-medium overflow-ellipsis max-w-30">
                            {album.title}
                          </span>
                        </div>
                      ))}
                      {!artistAlbums[artist.id] && (
                        <div className="text-gray-500">Loading albums...</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-105 p-4 pallete-color rounded flex flex-col items-center h-fit">
          <h3 className="font-bold text-lg">
            Your albums added to favorite ❤️
          </h3>
          <h2 className="mb-4 red-hat-display-400">
            Click on the album to remove it
          </h2>
          <Album favorites={favorites} onRemove={removeFromFavorites} />
        </div>
      </div>
    </div>
  );
}

export default App;
