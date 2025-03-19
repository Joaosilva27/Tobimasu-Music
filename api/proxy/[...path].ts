import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Get path segments and query parameters separately
  const path = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path || "";

  // 2. Extract original query params (excluding the path)
  const { path: _, ...cleanQuery } = req.query;
  const queryString = new URLSearchParams(
    cleanQuery as Record<string, string>
  ).toString();

  // 3. Construct proper Deezer API URL
  const apiUrl = `https://api.deezer.com/${path}${
    queryString ? `?${queryString}` : ""
  }`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Deezer API error: ${response.status}`);

    const data = await response.json();

    // 4. Send proper headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: error.message });
  }
}
