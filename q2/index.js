const express = require("express");
const axios = require("axios");

const app = express();
const port = 9876;
const WINDOW_SIZE = 10;

const ID_MAP = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand"
};

// === Client credentials (REGISTER ONCE, THEN USE THESE) ===
const CLIENT_CREDENTIALS = {
  email: "abhiramnasa@gmail.com",
  name: "abhiramaraju rallabandi",
  rollNo: "cb.en.u4aie22066",
  accessCode: "SwuuKE",
  clientID: "c3a14f11-6161-43aa-8b1d-762c71eddb0d",
  clientSecret: "cxuXWmRnDrWHyQag"
};

// === In-memory cache for token and window ===
let cachedToken = null;
let tokenExpiry = 0;
let numberWindow = [];

// === Auth Token Function ===
const getAuthToken = async () => {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiry > now) {
    return cachedToken;
  }

  try {
    const res = await axios.post("http://20.244.56.144/evaluation-service/auth", CLIENT_CREDENTIALS);
    cachedToken = res.data.access_token;
    tokenExpiry = now + 60 * 60; // Assume token valid for 1 hour
    return cachedToken;
  } catch (err) {
    console.error("Failed to get auth token:", err.message);
    return null;
  }
};

// === Fetch Numbers from External API with Timeout & Auth ===
const fetchNumbers = async (type) => {
  const token = await getAuthToken();
  if (!token) return [];

  const url = `http://20.244.56.144/evaluation-service/${type}`;
  try {
    const response = await axios.get(url, {
      timeout: 500,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.numbers || [];
  } catch (err) {
    console.warn("Fetch failed or timeout:", err.message);
    return [];
  }
};

// === Main Endpoint ===
app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;
  const type = ID_MAP[numberid];
  if (!type) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const windowPrevState = [...numberWindow];

  const fetchedNumbers = await fetchNumbers(type);

  for (const num of fetchedNumbers) {
    if (!numberWindow.includes(num)) {
      numberWindow.push(num);
      if (numberWindow.length > WINDOW_SIZE) {
        numberWindow.shift(); // Remove oldest
      }
    }
  }

  const avg =
    numberWindow.length > 0
      ? parseFloat((numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length).toFixed(2))
      : 0.0;

  res.json({
    windowPrevState,
    windowCurrState: numberWindow,
    numbers: fetchedNumbers,
    avg
  });
});

// === Start Server ===
app.listen(port, () => {
  console.log(`✅ Average Calculator running at http://localhost:${port}`);
});
