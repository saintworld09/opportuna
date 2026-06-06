const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const PORT = 5000;

// Himalayas API proxy
app.get("/api/jobs", async (req, res) => {
  try {
    const response = await axios.get(
      "https://himalayas.app/jobs/api/search?worldwide=true&page=1"
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});