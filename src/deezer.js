export default async function handler(req, res) {
  const { artist } = req.query; // Get the artist name from the query parameters
  if (!artist) {
    return res.status(400).json({ error: "Artist query is missing." });
  }

  const deezerUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(
    artist
  )}`;

  try {
    // Make the request to Deezer's API
    const response = await fetch(deezerUrl);

    // If the request was successful, return the data
    if (response.ok) {
      const data = await response.json();
      res.status(200).json({ data: data.data });
    } else {
      res
        .status(response.status)
        .json({ error: "Error fetching data from Deezer" });
    }
  } catch (error) {
    console.error("Error while calling Deezer API:", error);
    res
      .status(500)
      .json({ error: "Internal server error while fetching data from Deezer" });
  }
}
