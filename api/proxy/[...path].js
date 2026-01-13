export default async function handler(req, res) {
  const { path = [] } = req.query;

  // REMOVED /api/ from the middle because it comes from the 'path' variable
  const backendUrl = `http://65.1.107.122:4000/${path.join("/")}`;

  try {
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
      },
      body: req.method === "GET" || req.method === "HEAD" 
            ? null 
            : JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: "Proxy error" });
  }
}