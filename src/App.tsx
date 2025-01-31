import "./App.css";
import axios from "axios";
import Album from "./components/Album";
import { useEffect, useState } from "react";
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

  const onSearchForArtist = (e) => {
    e.preventDefault();

    axios
      .get(`https://api.deezer.com/search/artist?q=${searchArtist}`)
      .then((res) => {
        const data = res.data.data;
        setArtistResultList(data);
        setCurrentlySearchingText(searchArtist);
        setIsUserSearching(true);
        console.log(artistResultList);

        // fetching 5 albums for each artist
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

  return (
    <div className="flex flex-col p-4 min-h-screen">
      <div className="flex justify-center">
        <div className="text-2xl mb-14 font-bold">tobimasu</div>
        <img className="h-10 w-10" src={VinylIcon} />
      </div>

      <div className="flex w-full justify-between gap-8">
        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            <form className="flex w-full">
              <input
                className="flex-1 p-2 border rounded"
                onChange={(e) => setSearchArtist(e.target.value)}
                placeholder="Search for an artist's name"
                value={searchArtist}
              />
              <button
                className="px-4 py-2 bg-black rounded ml-2"
                onClick={onSearchForArtist}
              >
                SEARCH
              </button>
            </form>
          </div>

          {isUserSearching && (
            <div className="w-auto pallete-color">
              <span>
                You are currently searching for:{" "}
                <span className="font-bold">{currentlySearchingText}</span>
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

        <div className="w-80 p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-lg mb-4">YOUR FAVORITE ALBUMS</h3>
          <Album />
        </div>
      </div>
    </div>
  );
}

export default App;
