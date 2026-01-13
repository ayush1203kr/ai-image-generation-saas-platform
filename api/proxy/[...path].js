module.exports = async (req, res) => {
  const { path = [] } = req.query;
  
  // This directs the request to your AWS server
  const backendUrl = `http://65.1.107.122:4000/api/${path.join("/")}`;

  try {
    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
      },
    };

    // Only add a body for POST/PUT requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(backendUrl, options);
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Proxy failed to reach AWS", error: err.message });
  }
};