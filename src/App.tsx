import { useEffect, useState } from "react";
import axios from "axios";
import Album from "./components/Album";
import ArtistListResult from "./components/ArtistListResult";
import VinylIcon from "./icons/vinyl.png";
import { Link } from "react-router";

function App() {
  const [searchArtist, setSearchArtist] = useState<string>("");
  const [isUserSearching, setIsUserSearching] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<boolean>(false);
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

    const savedColor = localStorage.getItem("backgroundColor");
    if (savedColor) setBackgroundColor(JSON.parse(savedColor));
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
          axios.get(`https://api.deezer.com/artist/${artist.id}/albums?limit=6`)
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

  const onChangeBackgroundColor = () => {
    const newColorState = !backgroundColor;
    setBackgroundColor(newColorState);
    localStorage.setItem("backgroundColor", JSON.stringify(newColorState));
  };

  return (
    <div
      className={`flex flex-col min-h-screen p-20 pt-10 ${
        backgroundColor ? "bg-beige" : "pallete-color_background text-beige"
      }`}
    >
      <div className="relative flex justify-center items-center gap-2 mb-14">
        <button
          onClick={onChangeBackgroundColor}
          className={`px-4 py-2 rounded text-black absolute left-0 top-0 ${
            backgroundColor ? "pallete-color_background" : "bg-beige"
          }`}
        >
          Change Color
        </button>
        <span className="text-2xl font-bold red-hat-display-900">tobimasu</span>
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
                className="px-4 py-2 rounded ml-2 text-black bg-white"
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
                <span className="font-bold capitalize">
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

                  <div className="mt-3">
                    <h4 className="font-semibold mb-2">Top Albums:</h4>
                    <div className="flex gap-3 justify-center">
                      {artistAlbums[artist.id]?.map((album) => (
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

        {favorites.length > 0 && (
          <div className="w-105 p-4 pallete-color rounded flex flex-col items-center h-fit">
            <h3 className="font-bold text-lg">
              Your albums added to favorite ❤️
            </h3>
            <h2 className="mb-4">Click on the album to remove it</h2>
            <Album favorites={favorites} onRemove={removeFromFavorites} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
