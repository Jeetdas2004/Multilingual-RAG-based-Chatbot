/**
 * Pragya AI Chatbot Assistant Script
 * Handles RAG API communication, College Predictor, News Carousel,
 * Speech Recognition, Audio Synthesis, and View Switching.
 */

// Global App State
const state = {
  collegeName: "gpcajmer",
  collegeDisplayName: "GPC, Ajmer",
  language: "English",
  currentNewsIndex: 0,
  isListening: false,
  recognition: null,
  chatHistory: []
};

// Fallback News Items (synced with backend)
const newsItems = [
  {
    category: "Admissions",
    title: "DTE Rajasthan Polytechnic Admissions 2026 Announced",
    desc: "Department of Technical Education opens online registration for 1st Year Diploma and Lateral Entry 2nd Year courses on hte.rajasthan.gov.in."
  },
  {
    category: "Scholarships",
    title: "100% Tuition Fee Exemption for Female Students",
    desc: "Rajasthan Government reinforces zero tuition fee policy for all female candidates admitted to government polytechnic and technical institutes."
  },
  {
    category: "Financial Aid",
    title: "Post-Matric Scholarship Applications Open on SJED Portal",
    desc: "SC, ST, OBC (BPL), and EWS students can submit applications for complete tuition fee reimbursement through the SSO scholarship portal."
  },
  {
    category: "Infrastructure",
    title: "New Renewable Energy Labs at GPC Bikaner",
    desc: "Advanced solar simulation and testing laboratories commissioned to train diploma students for Rajasthan's expanding clean energy sector."
  },
  {
    category: "Placements",
    title: "Over 450 Diploma Engineers Recruited by Top Core Giants",
    desc: "Tata Motors, L&T, Maruti Suzuki, and Havells visit GPC campuses with packages ranging up to ₹5.50 LPA."
  }
];

// Fallback Colleges with Cutoffs
const collegesList = [
  { name: "GPC, Jaipur", minScore: 86, value: "gpcjaipur" },
  { name: "GPC, Ajmer", minScore: 82, value: "gpcajmer" },
  { name: "GPC, Jodhpur", minScore: 81, value: "gpcjodhpur" },
  { name: "GPC, Kota", minScore: 80, value: "gpckota" },
  { name: "GPC, Bikaner", minScore: 79, value: "gpcbikaner" },
  { name: "GPC, Alwar", minScore: 78, value: "gpcalwar" },
  { name: "GPC, Bundi", minScore: 75, value: "gpcbundi" },
  { name: "GPC, Baran", minScore: 74, value: "gpcbaran" },
  { name: "GPC, Bhilwara", minScore: 74, value: "gpcbhilwara" },
  { name: "GPC, Banswara", minScore: 73, value: "gpcbanswara" },
  { name: "GPC, Chittorgarh", minScore: 72, value: "gpcchittorgarh" },
  { name: "GPC, Bharatpur", minScore: 72, value: "gpcbharatpur" },
  { name: "GPC, Barmer", minScore: 70, value: "gpcbarmer" }
];

// DOM Elements
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.getElementById("close-btn");
const menuBtn = document.getElementById("menu-btn");
const drawerCloseBtn = document.getElementById("drawer-close-btn");
const infoDrawer = document.getElementById("info-drawer");

const dashboardView = document.getElementById("dashboard-view");
const chatView = document.getElementById("chat-view");
const backToDashBtn = document.getElementById("back-to-dash-btn");
const clearChatBtn = document.getElementById("clear-chat-btn");
const activeCollegeIndicator = document.getElementById("active-college-indicator");

const chatbox = document.getElementById("chatbox");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");

const collegeSelect = document.getElementById("college-select");
const languageSelect = document.getElementById("language-select");

const scoreInput = document.getElementById("score-input");
const predictBtn = document.getElementById("predict-btn");
const topCollegesList = document.getElementById("top-colleges-list");

const newsPrevBtn = document.getElementById("news-prev-btn");
const newsNextBtn = document.getElementById("news-next-btn");
const newsCategory = document.getElementById("news-category");
const newsTitle = document.getElementById("news-title");
const newsDesc = document.getElementById("news-desc");
const newsIndicatorBar = document.getElementById("news-indicator-bar");

// API Base URL
const API_BASE = "http://localhost:8000";

// ---------------- Helper Functions ----------------

/**
 * Parses markdown to HTML cleanly.
 */
function markdownToHtml(markdown) {
  if (!markdown) return "";
  let html = markdown
    // Headings
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold & Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    // Unordered lists
    .replace(/^\s*-\s+(.*)/gim, '<li>$1</li>')
    // Wrap lists into <ul>
    .replace(/(<li>.*?<\/li>)+/gims, '<ul>$&</ul>')
    // Paragraphs / Newlines
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');

  return html;
}

/**
 * Text-to-Speech synthesis in selected language
 */
function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop any active speech

  const cleanText = text.replace(/<[^>]*>/g, '').replace(/[#*`_]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  if (state.language.toLowerCase().includes("hindi") || state.language.toLowerCase().includes("hi")) {
    utterance.lang = "hi-IN";
  } else {
    utterance.lang = "en-IN";
  }
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

// ---------------- View Switching ----------------
function switchToChat() {
  dashboardView.style.display = "none";
  chatView.style.display = "flex";
  activeCollegeIndicator.textContent = state.collegeDisplayName;
}

function switchToDashboard() {
  chatView.style.display = "none";
  dashboardView.style.display = "flex";
}

// ---------------- Event Listeners for Controls ----------------

// Toggler Button
chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});

closeBtn.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
});

// Menu Drawer
menuBtn.addEventListener("click", () => {
  infoDrawer.classList.toggle("open");
});

drawerCloseBtn.addEventListener("click", () => {
  infoDrawer.classList.remove("open");
});

// View Navigation
backToDashBtn.addEventListener("click", switchToDashboard);

clearChatBtn.addEventListener("click", () => {
  chatbox.innerHTML = `
    <li class="chat incoming">
      <div class="bot-avatar"><span class="material-symbols-rounded">smart_toy</span></div>
      <div class="chat-bubble">
        <p>Chat history cleared. How may I assist you with Rajasthan Polytechnic colleges today?</p>
      </div>
    </li>
  `;
});

// Selectors
collegeSelect.addEventListener("change", (e) => {
  state.collegeName = e.target.value;
  state.collegeDisplayName = e.target.options[e.target.selectedIndex].text;
  activeCollegeIndicator.textContent = state.collegeDisplayName;
});

languageSelect.addEventListener("change", (e) => {
  state.language = e.target.value;
});

// Quick Prompts / Chips
document.querySelectorAll(".chip-btn").forEach(chip => {
  chip.addEventListener("click", () => {
    const query = chip.getAttribute("data-query");
    if (query) {
      chatInput.value = query;
      handleSendMessage();
    }
  });
});

// ---------------- College Predictor ----------------
function runCollegePredictor() {
  const val = parseFloat(scoreInput.value);
  if (isNaN(val) || val <= 0) {
    scoreInput.focus();
    return;
  }

  // Calculate top matches
  const sorted = collegesList
    .map(c => ({
      ...c,
      diff: Math.abs(val - c.minScore),
      eligible: val >= (c.minScore - 4)
    }))
    .sort((a, b) => {
      if (a.eligible && !b.eligible) return -1;
      if (!a.eligible && b.eligible) return 1;
      return a.diff - b.diff;
    })
    .slice(0, 3);

  topCollegesList.innerHTML = sorted.map(c => `
    <div class="college-item">
      <span class="college-name">${c.name}</span>
      <span class="college-badge">${c.minScore}%</span>
    </div>
  `).join('');
}

predictBtn.addEventListener("click", runCollegePredictor);
scoreInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runCollegePredictor();
});

// ---------------- News Carousel ----------------
function updateNewsCard() {
  const item = newsItems[state.currentNewsIndex];
  if (!item) return;

  newsCategory.textContent = item.category || "Update";
  newsTitle.textContent = item.title;
  newsDesc.textContent = item.description || item.desc;

  // Indicators
  const indicators = newsIndicatorBar.querySelectorAll(".indicator");
  indicators.forEach((ind, idx) => {
    ind.classList.toggle("active", idx === state.currentNewsIndex);
  });
}

newsPrevBtn.addEventListener("click", () => {
  state.currentNewsIndex = (state.currentNewsIndex - 1 + newsItems.length) % newsItems.length;
  updateNewsCard();
});

newsNextBtn.addEventListener("click", () => {
  state.currentNewsIndex = (state.currentNewsIndex + 1) % newsItems.length;
  updateNewsCard();
});

// Auto-advance news carousel every 6 seconds
setInterval(() => {
  state.currentNewsIndex = (state.currentNewsIndex + 1) % newsItems.length;
  updateNewsCard();
}, 6000);

// ---------------- Chat Message Handling ----------------

function createChatLi(content, className, isHTML = false) {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  
  if (className === "outgoing") {
    chatLi.innerHTML = `<div class="chat-bubble"><p>${content}</p></div>`;
  } else {
    chatLi.innerHTML = `
      <div class="bot-avatar"><span class="material-symbols-rounded">smart_toy</span></div>
      <div class="chat-bubble">
        <div class="bubble-content">${isHTML ? content : `<p>${content}</p>`}</div>
      </div>
    `;
  }
  return chatLi;
}

function handleSendMessage() {
  const userText = chatInput.value.trim();
  if (!userText) return;

  // Switch to chat view
  switchToChat();

  // Clear input
  chatInput.value = "";

  // Append user bubble
  chatbox.appendChild(createChatLi(userText, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Append typing indicator bubble
  const typingLi = createChatLi(
    `<div class="typing-dots"><span></span><span></span><span></span></div> <span style="font-size:0.75rem; color:#64748b;">Pragya is searching DTE records...</span>`,
    "incoming",
    true
  );
  chatbox.appendChild(typingLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Send request to Backend API
  fetch(`${API_BASE}/ask_query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: userText,
      college_name: state.collegeName,
      lang: state.language
    })
  })
  .then(res => res.json())
  .then(data => {
    typingLi.remove();

    const formattedAnswer = markdownToHtml(data.answer);
    const responseLi = createChatLi(formattedAnswer, "incoming", true);

    // Add Action Buttons (Text-To-Speech & Copy)
    const bubbleActions = document.createElement("div");
    bubbleActions.className = "bubble-actions";
    bubbleActions.innerHTML = `
      <button class="action-icon-btn speak-btn" title="Listen Aloud">
        <span class="material-symbols-rounded">volume_up</span> Speak
      </button>
      <button class="action-icon-btn copy-btn" title="Copy Text">
        <span class="material-symbols-rounded">content_copy</span> Copy
      </button>
    `;

    bubbleActions.querySelector(".speak-btn").addEventListener("click", () => {
      speakText(data.answer);
    });

    bubbleActions.querySelector(".copy-btn").addEventListener("click", (e) => {
      navigator.clipboard.writeText(data.answer).then(() => {
        e.target.closest("button").innerHTML = `<span class="material-symbols-rounded">check</span> Copied!`;
        setTimeout(() => {
          bubbleActions.querySelector(".copy-btn").innerHTML = `<span class="material-symbols-rounded">content_copy</span> Copy`;
        }, 2000);
      });
    });

    responseLi.querySelector(".chat-bubble").appendChild(bubbleActions);
    chatbox.appendChild(responseLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  })
  .catch(err => {
    typingLi.remove();
    console.error("Chat API error:", err);
    const errorLi = createChatLi(
      `⚠️ Could not reach the local server at ${API_BASE}.<br>Please ensure the Python backend is running via <code>python api.py</code>.<br><br>For immediate help, call the Rajasthan DTE Helpline: <strong>1800-180-6127</strong>.`,
      "incoming",
      true
    );
    chatbox.appendChild(errorLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  });
}

// Input Key & Click Triggers
sendBtn.addEventListener("click", handleSendMessage);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSendMessage();
  }
});

// ---------------- Speech-to-Text Microphone ----------------
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  state.recognition = new SpeechRecognition();
  state.recognition.continuous = false;
  state.recognition.interimResults = false;

  state.recognition.onstart = () => {
    state.isListening = true;
    micBtn.classList.add("listening");
    chatInput.placeholder = "Listening... Speak now";
  };

  state.recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    micBtn.classList.remove("listening");
    state.isListening = false;
    chatInput.placeholder = "Enter your Text....";
    handleSendMessage();
  };

  state.recognition.onerror = () => {
    micBtn.classList.remove("listening");
    state.isListening = false;
    chatInput.placeholder = "Enter your Text....";
  };

  state.recognition.onend = () => {
    micBtn.classList.remove("listening");
    state.isListening = false;
    chatInput.placeholder = "Enter your Text....";
  };

  micBtn.addEventListener("click", () => {
    if (state.isListening) {
      state.recognition.stop();
    } else {
      if (state.language.toLowerCase().includes("hindi") || state.language.toLowerCase().includes("hi")) {
        state.recognition.lang = "hi-IN";
      } else {
        state.recognition.lang = "en-IN";
      }
      state.recognition.start();
    }
  });
} else {
  micBtn.title = "Voice recognition not supported in this browser";
  micBtn.style.opacity = "0.5";
}

// ---------------- Initial Setup ----------------
document.addEventListener("DOMContentLoaded", () => {
  updateNewsCard();

  // Fetch live colleges from API if available
  fetch(`${API_BASE}/colleges`)
    .then(res => res.json())
    .then(data => {
      if (data && data.colleges && data.colleges.length > 0) {
        collegeSelect.innerHTML = data.colleges.map(c => `
          <option value="${c.value}">${c.name}</option>
        `).join('');
        state.collegeName = collegeSelect.value;
        state.collegeDisplayName = collegeSelect.options[0].text;
      }
    })
    .catch(() => {
      // Keep static defaults
    });
});
