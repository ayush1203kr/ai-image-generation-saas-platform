export default async function handler(req, res) {
  const { path = [] } = req.query;
  const backendUrl = `http://65.1.107.122:4000/api/${path.join("/")}`;

  try {
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization || "",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch {
    res.status(500).json({ success: false, message: "Proxy error" });
  }
}
