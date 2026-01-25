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
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch {
    res.status(500).json({
      success: false,
      message: "Proxy error",
    });
  }
}
