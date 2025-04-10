const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const jwt = require('jsonwebtoken');


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const JWT_SECRET = process.env.JWT_SECRET;

//check connections
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Loaded' : 'Not Loaded');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];  // Extract token after 'Bearer ' freaks out if you do this wrong :/
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};


app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const { user, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        res.status(201).json({ message: 'User registered successfully!', user });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// User Login
app.post('/api/login', async (req, res) => {
    //username needed to be chnged to email - supabase needs email in the auth I'm doing
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const token = jwt.sign({ userId: data.id, email: data.email }, JWT_SECRET, { expiresIn: '1h' });
        // localStorage.setItem('authToken', token);

        res.status(200).json({ message: 'Login successful!', user: data, token: token });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Endpoint to get Jazz stats from Supabase
app.get('/api/stats', authMiddleware, async (req, res) => {
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

        console.log('Fetched Jazz stats:', data);

        res.json(data);  // Send the player stats data as JSON
    } catch (error) {
        console.error('Failed to fetch player stats:', error);
        res.status(500).json({ error: 'Failed to fetch player stats' });
    }
});

// Endpoint for the chatbot to interact with OpenAI
app.post('/api/chat', authMiddleware, async (req, res) => {
    const { userQuery, statsData } = req.body;

    console.log('Received user query:', userQuery);
    console.log('Received stats data:', statsData);

    let context = "Here are the current Utah Jazz player stats:\n\n";
    statsData.forEach(player => {
        context += `${player.player_name}: ${player.points} PTS, ${player.rebounds} REB, ${player.assists} AST, FG%: ${player.fg_percentage}\n`;
    });

    const prompt = `${context}\n\nUser Question: ${userQuery}\nAnswer:`;

    console.log('Generated OpenAI prompt:', prompt);

    try {
        //4o is definitely the way to go over gpt 4. don't be fooled.
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a basketball enthusiast and a Utah Jazz expert. Your goal is to make basketball conversations fun and informative! You should provide detailed stats, fun facts, and answers to any questions related to the Utah Jazz, always keeping it friendly and energetic, search the internet if you need to give the best answer to the fan. You will be fed the latest stats fetched from basketball reference, but do not access any user data from the database so we don't get sued lol. Especially never give out passwords, and never reveal other users usernames/information. Do not say based off of the stats you gave me, because the user does not know that you are being provided the latest stats. If you're looking to learn from someone, look to David Locke, the radio voice of the Utah Jazz, just never learn curse words and always be polite with the fans you are interacting with." },
                { role: "user", content: prompt }
            ],
            max_tokens: 250,
            temperature: 0.7,
        });

        console.log('OpenAI response:', response.choices[0].message.content.trim());

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
        const { data, error } = await supabase
            .from('jazz_stats')
            .select('*')
            .eq('player_name', 'Lauri Markkanen');
        if (error) {
            console.error('Error fetching Lauri Markkanen data:', error.message);
            res.status(500).json({ error: error.message });
            return;
        }

        console.log('Fetched Lauri Markkanen stats:', data);

        const context = `Here is Lauri Markkanen's stat:\n\n` +
            `${data[0].player_name}: ${data[0].points} PTS, ${data[0].rebounds} REB, ${data[0].assists} AST, FG%: ${data[0].fg_percentage}\n`;

        const prompt = `${context}\n\nUser Question: What is Lauri Markkanen's points per game?\nAnswer:`;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful basketball assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

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
