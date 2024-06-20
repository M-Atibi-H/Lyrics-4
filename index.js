const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

const geniusApiKey = "9O6O_bjrVM8amuAME52ATDupZQoVb8-6Lnrpz9SPbBo6JM5P0m_VMO9vwfyyKBh0"; // Replace with your Genius API key

app.use(cors()); // Enable CORS

app.get('/lyrics', async (req, res) => {
  const songTitle = req.query.song;

  if (!songTitle) {
    return res.status(400).json({ error: 'Song parameter is required' });
  }

  try {
    const searchResponse = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(songTitle)}`, {
      headers: {
        'Authorization': `Bearer ${geniusApiKey}`
      }
    });

    if (searchResponse.data.response.hits.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const songId = searchResponse.data.response.hits[0].result.id;
    const songResponse = await axios.get(`https://api.genius.com/songs/${songId}`, {
      headers: {
        'Authorization': `Bearer ${geniusApiKey}`
      }
    });

    const songData = songResponse.data.response.song;

    return res.json({
      title: songData.full_title,
      url: songData.url
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
    return res.status(500).json({ error: `An error occurred: ${errorMessage}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
