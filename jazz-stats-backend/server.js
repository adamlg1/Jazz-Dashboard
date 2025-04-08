const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();  // Load environment variables

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());  // To handle JSON requests

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Debug statement to verify connection to Supabase and OpenAI setup
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Loaded' : 'Not Loaded');

// Endpoint to get Jazz stats from Supabase
app.get('/api/stats', async (req, res) => {
    console.log('Fetching stats from Supabase...');
    try {
        const { data, error } = await supabase
            .from('jazz_stats')
            .select('*');  // Adjust this query based on your table structure

        if (error) {
            console.error('Error fetching data from Supabase:', error.message);
            res.status(500).json({ error: error.message });
            return;
        }

        // Debug: log the fetched data
        console.log('Fetched Jazz stats:', data);

        res.json(data);  // Send the player stats data as JSON
    } catch (error) {
        console.error('Failed to fetch player stats:', error);
        res.status(500).json({ error: 'Failed to fetch player stats' });
    }
});

// Endpoint for the chatbot to interact with OpenAI
app.post('/api/chat', async (req, res) => {
    const { userQuery, statsData } = req.body;

    // Debug: log the incoming query and statsData
    console.log('Received user query:', userQuery);
    console.log('Received stats data:', statsData);

    // Prepare the context with the fetched stats
    let context = "Here are the current Utah Jazz player stats:\n\n";
    statsData.forEach(player => {
        context += `${player.player_name}: ${player.points} PTS, ${player.rebounds} REB, ${player.assists} AST, FG%: ${player.fg_percentage}\n`;
    });

    const prompt = `${context}\n\nUser Question: ${userQuery}\nAnswer:`;

    // Debug: log the generated prompt before calling OpenAI
    console.log('Generated OpenAI prompt:', prompt);

    try {
        // Call OpenAI API to generate a response using the correct endpoint for chat models
        const response = await openai.chat.completions.create({
            model: "gpt-4",  // Correct model name
            messages: [
                { role: "system", content: "You are a basketball enthusiast and a Utah Jazz expert. Your goal is to make basketball conversations fun and informative! You should provide detailed stats, fun facts, and answers to any questions related to the Utah Jazz, always keeping it friendly and energetic, search the internet if you need to give the best answer to the fan. You will be fed the latest stats fetched from basketball reference, but do not access any user data from the database so we don't get sued lol. Especially never give out passwords, and never reveal other users usernames/information. Do not say based off of the stats you gave me, because the user does not know that you are being provided the latest stats. If you're looking to learn from someone, look to David Locke, the radio voice of the Utah Jazz, just never learn curse words and always be polite with the fans you are interacting with." },
                { role: "user", content: prompt }
            ],
            max_tokens: 250,
            temperature: 0.7,
        });

        // Debug: log OpenAI's response
        console.log('OpenAI response:', response.choices[0].message.content.trim());

        // Return OpenAI response
        res.json({ answer: response.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).send('Error with OpenAI API');
    }
});

// Test Endpoint: Simulate a test for Lauri Markkanen's stats
app.get('/api/test-markkanen', async (req, res) => {
    console.log('Testing Lauri Markkanen stats...');
    try {
        // Fetch Jazz stats from Supabase
        const { data, error } = await supabase
            .from('jazz_stats')
            .select('*')
            .eq('player_name', 'Lauri Markkanen');  // Fetch data for Lauri Markkanen

        if (error) {
            console.error('Error fetching Lauri Markkanen data:', error.message);
            res.status(500).json({ error: error.message });
            return;
        }

        // Debug: log Lauri Markkanen's stats
        console.log('Fetched Lauri Markkanen stats:', data);

        // Prepare the context for OpenAI
        const context = `Here is Lauri Markkanen's stat:\n\n` +
            `${data[0].player_name}: ${data[0].points} PTS, ${data[0].rebounds} REB, ${data[0].assists} AST, FG%: ${data[0].fg_percentage}\n`;

        const prompt = `${context}\n\nUser Question: What is Lauri Markkanen's points per game?\nAnswer:`;

        // Call OpenAI API to generate a response using the correct endpoint for chat models
        const response = await openai.chat.completions.create({
            model: "gpt-4",  // Correct model name
            messages: [
                { role: "system", content: "You are a helpful basketball assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        // Return OpenAI response for Lauri Markkanen
        res.json({ answer: response.choices[0].message.content.trim() });

    } catch (error) {
        console.error('Error with Lauri Markkanen test:', error);
        res.status(500).send('Error testing Lauri Markkanen stats');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
