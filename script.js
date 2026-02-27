// script.js
// Handles tab navigation and UI interactions for the Placement Prep AI Assistant

const API_URL = 'http://localhost:3001/api/generate';

// Utility function to switch active tab and panel
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === tabName);
  });
}

// Initialize tab event listeners
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// Generic function to call the AI backend
async function callAI(prompt, outputElement) {
  const originalText = outputElement.textContent;
  outputElement.textContent = 'Thinking... 🤖';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if (data.answer) {
      outputElement.textContent = data.answer;
    } else {
      outputElement.textContent = `Error: ${data.error || 'Unknown error'}`;
    }
  } catch (err) {
    console.error(err);
    outputElement.textContent = 'Failed to contact AI service. Make sure the server is running on port 3001.';
  }
}

// ----- Resume Improvement -----
const resumeBtn = document.getElementById('resume-analyze');
resumeBtn.addEventListener('click', () => {
  const input = document.getElementById('resume-input').value.trim();
  const outputEl = document.getElementById('resume-output');
  if (!input) {
    outputEl.textContent = 'Please paste your resume text above.';
    return;
  }
  const prompt = `Act as a senior technical recruiter. Review this resume and provide 5 specific improvements, focusing on impact, keywords, and formatting. Resume text:\n\n${input}`;
  callAI(prompt, outputEl);
});

// ----- Interview Q&A -----
const askBtn = document.getElementById('ask-btn');
askBtn.addEventListener('click', () => {
  const category = document.getElementById('category-select').value;
  const question = document.getElementById('question-input').value.trim();
  const answerEl = document.getElementById('answer-output');
  if (!question) {
    answerEl.textContent = 'Please type a question.';
    return;
  }
  const prompt = `Give a professional, structured answer for a ${category} interview question. Use the STAR method if applicable. Question: ${question}`;
  callAI(prompt, answerEl);
});

// ----- Aptitude Problem Solving -----
const newProblemBtn = document.getElementById('new-problem');
newProblemBtn.addEventListener('click', () => {
  const problemEl = document.getElementById('problem-output');
  const prompt = "Generate a challenging quantitative aptitude or logical reasoning problem (with options) common in tech company placement tests.";
  callAI(prompt, problemEl);
});

const checkSolutionBtn = document.getElementById('check-solution');
checkSolutionBtn.addEventListener('click', () => {
  const problem = document.getElementById('problem-output').textContent;
  const solution = document.getElementById('solution-input').value.trim();
  const feedbackEl = document.getElementById('solution-feedback');
  if (!solution) {
    feedbackEl.textContent = 'Write your solution above to get feedback.';
    return;
  }
  const prompt = `Context: ${problem}\n\nThe student solved it as follows: ${solution}. Check if this is correct, explain the logic, and give a faster tip/short-cut if possible.`;
  callAI(prompt, feedbackEl);
});

// ----- Project Explanation Guidance -----
const projectGuideBtn = document.getElementById('project-guide');
projectGuideBtn.addEventListener('click', () => {
  const projectDesc = document.getElementById('project-input').value.trim();
  const projectOut = document.getElementById('project-output');
  if (!projectDesc) {
    projectOut.textContent = 'Provide a brief description of your project.';
    return;
  }
  const prompt = `I have this project: ${projectDesc}. Help me explain it to an interviewer in 2 minutes. Focus on: Problem solved, Tech stack choice, Personal contribution, and One challenging obstacle overcome.`;
  callAI(prompt, projectOut);
});

// Initialize default view
switchTab('resume');
