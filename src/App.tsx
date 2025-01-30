import "./App.css";
import axios from "axios";
import Album from "./components/Album";
import { useEffect, useState } from "react";

function App() {
  const [searchArtist, setSearchArtist] = useState<string>("");
  const [isUserSearching, setIsUserSearching] = useState<boolean>(false);

  const onSearchForArtist = () => {
    axios
      .get(`https://api.deezer.com/search/artist?q=${searchArtist}`)
      .then((res) => {
        const data = res.data.data;
        console.log(data);
        console.log("afaij");

        setIsUserSearching(true); // this is used in order to showcase the dropdown menu once someone searches
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(searchArtist);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="text-2xl mb-14">musicock</div>
        <div>
          <input
            onChange={(e) => setSearchArtist(e.target.value)}
            placeholder="Search for a artist's name"
          />
          <button onClick={onSearchForArtist}>SEARCH</button>
          {isUserSearching && <div>afoiajfoi</div>}
          <Album />
        </div>
      </div>
    </>
  );
}

export default App;
