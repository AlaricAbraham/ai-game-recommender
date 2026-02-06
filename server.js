require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");  // Import path module to manage file paths

const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const IGDB_API_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_API_AUTH_TOKEN = process.env.IGDB_ACCESS_TOKEN;

// Enable CORS for all routes
app.use(cors());  // Use the CORS middleware here

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utility function to add delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Endpoint 1: Get game recommendations from OpenAI API
app.post("/get-game-recommendations", async (req, res) => {
    const { query } = req.body;

    // Define a helper function with retry logic
    async function fetchRecommendations(retryCount = 3) {
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system",
                            content:
                                `You are a helpful assistant for a game recommendation app. 
                                you will receieve a string including the user's query and a list of titles of games they completed. 
                                The user's query and the list of their games will be seperated by the phrase'USER'S PLAY HISTORY:'
                                You will then return a comma-seperated list of 20 game titles. By default, you will consider their playhistory in your recommendations. 
                                Allow the user's query to remove their playhistory from your consideration. Prefer highly acclaimed games unless specified otherwise 
                                in the query. Make sure your returned response is a comma-seperated list (with no spaces after commas) and nothing else!`,
                        },
                        {
                            role: "user",
                            content: query,
                        },
                    ],
                    max_tokens: 250,
                    temperature: 0.5,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                }
            );

            const gameTitles = response.data.choices[0].message.content;
            return gameTitles.split(",");
        } catch (error) {
            if (error.response && error.response.status === 429 && retryCount > 0) {
                console.warn("Rate limit exceeded. Retrying in 2 seconds...");
                await delay(2000); // Wait 2 seconds before retrying
                return fetchRecommendations(retryCount - 1);
            } else {
                console.error("Error with OPENAI API:", error);
                throw new Error("Failed to fetch game recommendations");
            }
        }
    }

    try {
        const gameTitles = await fetchRecommendations();
        res.json({ gameTitles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Helper function to format Unix timestamp to a readable date
function formatReleaseDate(unixTimestamp) {
    if (!unixTimestamp) return "Release date not available"; // Handle missing date
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}


// Endpoint 2: Get game info from IGDB API
app.post("/get-igdb-game-info", async (req, res) => {
    const { gameTitles } = req.body;

    // Helper function to delay execution
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
        const queries = gameTitles.map((title) =>
            `fields id, name, cover.url, rating, genres.name, summary, first_release_date, game_modes.name, platforms.name, screenshots.url, storyline, url; search "${title.trim()}"; where category = 0; limit 20;`
        );

        const gamesData = [];
        for (let i = 0; i < queries.length; i++) {
            try {
                const response = await axios.post(
                    "https://api.igdb.com/v4/games",
                    queries[i],
                    {
                        headers: {
                            "Client-ID": IGDB_API_CLIENT_ID,
                            Authorization: `Bearer ${IGDB_API_AUTH_TOKEN}`,
                        },
                    }
                );

                // Filter results to include exact matches or fallback to the first result
                const title = gameTitles[i].toLowerCase();
                const game =
                    response.data.find(
                        (game) => game.name.toLowerCase() === title
                    ) || response.data[0];

                if (game) {
                    // Format the release date for each game
                    game.first_release_date = formatReleaseDate(
                        game.first_release_date
                    );
                }

                gamesData.push(game);
            } catch (requestError) {
                console.error(`Error fetching data for "${gameTitles[i]}":`, requestError.message);
                gamesData.push(null); // Push null to maintain indexing if an individual request fails
            }

            // Add delay to respect rate limit (250ms per request = 4 requests per second)
            if (i < queries.length - 1) {
                await delay(250);
            }
        }

        res.json({ games: gamesData });
    } catch (error) {
        console.error("Error with IGDB API:", error);
        res.status(500).json({ error: "Failed to fetch game information" });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
