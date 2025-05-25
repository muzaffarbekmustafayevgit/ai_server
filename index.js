require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // CORS middleware

const app = express();
const port = 3000;

// ✅ CORS ni faqat GET va POST uchun ruxsat beramiz
app.use(cors({
    origin: '*', // yoki 'http://localhost:5173' kabi frontend manzilingiz
    methods: ['GET', 'POST']
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Gemini API sozlamalari
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// POST: Gemini'dan matn generatsiya qilish
app.post('/generate-content', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required in the request body.' });
    }

    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const geminiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Javob topilmadi.';
        res.send(geminiText);

    } catch (error) {
        console.error('Error calling Gemini API:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to communicate with Gemini API', 
            details: error.response?.data || error.message 
        });
    }
});

// Oddiy GET yo‘li
app.get('/', (req, res) => {
    res.send('Salom, bu Gemini API server!');
});

// Serverni ishga tushirish
app.listen(port, () => {
    console.log(`🚀 Server ishlayapti: http://localhost:${port}`);
    console.log(`👉 POST so‘rov yuborish: http://localhost:${port}/generate-content`);
});
