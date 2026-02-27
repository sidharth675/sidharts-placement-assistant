# Sidharth's Placement Assistant

## Overview
This is a lightweight, premium‑styled web interface that helps students prepare for placement interviews across **tech** and **non‑tech** roles. It provides four main capabilities:

1. **Resume Improvement** – Paste your resume and get AI‑driven suggestions.
2. **Interview Q&A** – Ask HR/behavioral or technical questions and receive structured answers.
3. **Aptitude Problem Solving** – Generate practice problems, submit solutions, and receive feedback.
4. **Project Explanation Guidance** – Describe your project and receive a polished, interview‑ready explanation.

The UI is built with vanilla HTML, CSS, and JavaScript, featuring a dark‑mode, glass‑morphism design, smooth animations, and responsive layout.

---

## Getting Started
1. **Open the app**
   - Double‑click `index.html` in the `assistant ai` folder, or serve the directory with a local web server (see step 2).
2. **Run a local server (recommended)**
   ```bash
   cd "/Users/siddharthsanthosh/Desktop/assistant ai"
   python3 -m http.server 8000
   ```
   Then navigate to `http://localhost:8000` in your browser.
3. **Interact**
   - Switch tabs using the navigation bar.
   - Fill in the text areas and click the action buttons.  Currently the buttons show placeholder messages.

---

## Next Steps – Integrating AI
The UI is ready; you now need a backend that calls an LLM (e.g., OpenAI's `gpt‑4o`). Below is a minimal **Node.js** example using **Express** and the **OpenAI** SDK.

### 1. Install dependencies
```bash
npm init -y
npm install express openai cors dotenv
```
Create a `.env` file with your API key:
```
OPENAI_API_KEY=sk-************
```
### 2. `server.js`
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generic endpoint – send {prompt: string}
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    res.json({ answer: completion.choices[0].message.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'LLM request failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```
### 3. Connect the frontend
Replace the placeholder sections in `script.js` with a `fetch` call, e.g.:
```javascript
fetch('http://localhost:3001/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: `Improve this resume:\n${input}` })
})
  .then(r => r.json())
  .then(data => outputEl.textContent = data.answer)
  .catch(err => outputEl.textContent = 'Error contacting AI');
```
Do similar for interview Q&A, aptitude feedback, and project guidance.

---

## Tips to Stand Out in Interviews (Content for the AI)
When the assistant generates responses, follow these guidelines for maximum impact:

1. **STAR Method** – Structure behavioral answers as *Situation, Task, Action, Result*.
2. **Quantify Impact** – Mention numbers (e.g., "increased throughput by 30%") wherever possible.
3. **Show Learning** – Highlight what you learned and how you applied it later.
4. **Tailor to Role** – Align your experience with the job description keywords.
5. **Ask Insightful Questions** – End interviews with thoughtful queries about team culture, product roadmap, or tech stack.
6. **Portfolio Ready** – Have a live demo or GitHub repo ready; the *Project Guidance* tab can help you craft a concise pitch.

---

## License & Credits
- UI design: custom, inspired by modern glass‑morphism trends.
- Icons & fonts: Google Fonts (Inter).
- Backend example uses the OpenAI SDK (MIT License).

Feel free to extend the assistant with additional modules (e.g., mock interview timers, analytics, or a chatbot UI).
