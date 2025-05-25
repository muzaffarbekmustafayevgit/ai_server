require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Your Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Route to handle Gemini API requests
app.post('/generate-content', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required in the request body.' });
    }

    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Faqatgina asosiy matnni ajratib olish
        const geminiText = response.data.candidates && response.data.candidates.length > 0
            ? response.data.candidates[0].content.parts[0].text
            : 'Javob topilmadi.';

        // Faqat matnni javob sifatida yuborish
        res.send(geminiText); // res.json o'rniga res.send() ishlatamiz, chunki faqat matn yuboryapmiz

    } catch (error) {
        console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: 'Failed to communicate with Gemini API', 
            details: error.response ? error.response.data : error.message 
        });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Node.js server listening at http://localhost:${port}`);
    console.log(`Access the Gemini API endpoint at http://localhost:${port}/generate-content`);
});