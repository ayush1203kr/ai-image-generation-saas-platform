module.exports = async (req, res) => {
  // Extract path and ensure it's treated as an array
  let { path = [] } = req.query;
  if (typeof path === 'string') path = [path];
  
  // Construct the target AWS URL
  const backendUrl = `http://65.1.107.122:4000/api/${path.join("/")}`;

  console.log("Routing request to:", backendUrl);

  try {
    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
      },
    };

    // Forward the body for non-GET requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(backendUrl, options);
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      const text = await response.text();
      return res.status(response.status).send(text);
    }
  } catch (err) {
    console.error("PROXY ERROR:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Proxy failed to reach AWS", 
      error: err.message 
    });
  }
};