export default async function handler(req, res) {
  const { path = [] } = req.query;
  
  // Connects Vercel to your AWS HTTP IP
  const backendUrl = `http://65.1.107.122:4000/${path.join("/")}`;

  try {
    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
      },
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(backendUrl, options);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch {
    res.status(500).json({ success: false, message: "Proxy could not reach AWS" });
  }
}