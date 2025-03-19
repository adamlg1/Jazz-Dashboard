const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS to allow the React app to make requests
app.use(cors());

// Sample Jazz Stats Data
const jazzStats = [
    { player: "Lauri Markkanen", points: 19.0, rebounds: 5.9, assists: 1.5, steals: 0.7, blocks: 0.4, "+/-": 2.3 },
    { player: "Keyonte George", points: 16.8, rebounds: 3.8, assists: 5.8, steals: 0.7, blocks: 0.2, "+/-": -1.5 },
    { player: "John Collins", points: 19.0, rebounds: 8.2, assists: 2.0, steals: 1.0, blocks: 1.0, "+/-": 1.4 },
    { player: "Walker Kessler", points: 11.5, rebounds: 12.5, assists: 1.6, steals: 0.6, blocks: 2.4, "+/-": 3.2 },
    // Add more player data as needed
];

// Endpoint to get jazz stats
app.get('/api/jazz-stats', (req, res) => {
    res.json(jazzStats);  // Send the sample data as JSON
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
