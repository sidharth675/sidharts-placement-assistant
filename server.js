// server.js
// Minimal Express server that forwards prompts to AI.
// Automatically detects and supports both OpenAI (sk-...) and Groq (gsk_...) keys.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error('❌ OPENAI_API_KEY is missing from .env');
    process.exit(1);
}

// Detection Logic
const isOpenAI = apiKey.startsWith('sk-');
const isGroq = apiKey.startsWith('gsk_');
const useMock = !isOpenAI && !isGroq;

const app = express();
app.use(cors());
app.use(express.json());

let openai = null;
if (!useMock) {
    try {
        const config = { apiKey: apiKey };
        if (isGroq) {
            config.baseURL = "https://api.groq.com/openai/v1";
        }
        openai = new OpenAI(config);
    } catch (e) {
        console.error('❌ AI Initialization failed:', e.message);
        process.exit(1);
    }
}

app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    console.log(`🔔 Request: ${prompt.substring(0, 40)}...`);

    if (useMock) {
        return res.json({ answer: "🧪 MOCK MODE: Please provide an 'sk-...' or 'gsk_...' key." });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });
        res.json({ answer: completion.choices[0].message.content });
    } catch (err) {
        console.error('AI Error:', err.message);
        res.status(500).json({ error: `AI request failed: ${err.message}` });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('-------------------------------------------');
    console.log(`🚀 Server listening at http://localhost:${PORT}`);
    console.log(`🔧 Mode: ${isGroq ? 'Groq (Llama 3.3)' : isOpenAI ? 'OpenAI' : 'MOCK'}`);
    console.log('-------------------------------------------');
});
