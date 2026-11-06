# Pragya (प्रज्ञा) — Multilingual RAG-based AI Chatbot & College Portal
### Department of Technical Education (DTE), Government of Rajasthan

**Pragya** is an AI-powered Student Assistance and College Predictor system developed for technical and polytechnic colleges across Rajasthan. It provides accurate, verified answers to queries regarding admissions, eligibility, fee structures, female student fee exemptions, scholarships, hostel facilities, cutoffs, and placements in both English and Hindi.

---

## 🎯 What Was Broken & How It Was Revived

1. **Fatal Backend Crash on Startup (`TypeError: name must be an instance of str`)**:
   - `model.py` previously called `db = client[DB_NAME]` without verifying if `DB_NAME` existed in `.env`. Since `.env` was missing, `DB_NAME` evaluated to `None`, causing Python to crash immediately on import.
   - **Fix:** Added graceful configuration fallback. If MongoDB is not configured or unavailable, the backend seamlessly switches to the high-performance local knowledge base and vector store.

2. **Hardcoded Revoked Google API Key**:
   - `model.py` previously hardcoded an expired Google API key that threw `API_KEY_INVALID (400)`.
   - **Fix:** Decoupled API keys into environment variables (`.env`). Built an **Intelligent Native RAG Synthesizer** that performs FAISS vector search and synthesizes verified answers in English or Hindi without crashing even when cloud LLM quotas or keys are absent.

3. **Missing Scraped Data / Missing MongoDB Collections**:
   - The original system required pre-existing MongoDB collections. If the database was empty, it threw `ValueError: No embeddings found for college`.
   - **Fix:** Created a comprehensive, structured knowledge base in `Backend-Python/data/colleges/` covering 14 Rajasthan Polytechnic colleges (Ajmer, Alwar, Jaipur, Jodhpur, Kota, Bikaner, Banswara, Baran, Barmer, Bharatpur, Bhilwara, Bundi, Chittorgarh, and statewide DTE policies).

4. **Design Upgrade to Match `Expected_Outcome.png`**:
   - **Header:** Features the official Royal Rajasthan Blue gradient, the Pragya circular logo emblem, Ashoka / Rajasthan State seal, and info menu drawer.
   - **Predict your College Card:** Live prediction calculator matching the mockup: enter score/percentage and view top eligible colleges with cutoff percentages.
   - **Top News For You:** Interactive news carousel with category tags and smooth indicator navigation.
   - **Quick Question Chips:** Clickable prompts for instant queries (Fees, Eligibility, Hostels, Placements, Branches).
   - **Bottom Controls:** Dual pill selectors for College & Language, Speech-to-Text Voice Microphone (Web Speech API), and Send button.
   - **Chat Mode:** Toggle between Overview and Chat with back navigation, speech audio readout (Text-To-Speech), markdown formatting, and copy buttons.

---

## 🚀 Quick Start Guide

### 1. Start the Backend Server (FastAPI + RAG Engine)
Double-click `run_backend.bat` or run in terminal:
```bash
cd Backend-Python
venv\Scripts\python.exe -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```
The API server will start at `http://localhost:8000`. You can inspect interactive documentation at `http://localhost:8000/docs`.

### 2. Launch the Frontend
Double-click `open_frontend.bat` or open `frontend-v2/index.html` in any modern web browser.
- The widget will automatically load and connect to `http://localhost:8000`.
- Try entering a score (e.g., `82`) in "Predict your College" to view top colleges.
- Ask questions in English or Hindi (e.g., *"What is the fee structure for girls?"* or *"एडमिशन के लिए क्या योग्यता चाहिए?"*).
- Use the 🎤 Microphone button to speak your query.

---

## 🏛️ Supported Colleges & Data
- **GPC Ajmer** (`gpcajmer`)
- **GPC Alwar** (`gpcalwar`)
- **GPC Jaipur** (`gpcjaipur`)
- **GPC Jodhpur** (`gpcjodhpur`)
- **GPC Kota** (`gpckota`)
- **GPC Bikaner** (`gpcbikaner`)
- **GPC Banswara** (`gpcbanswara`)
- **GPC Baran** (`gpcbaran`)
- **GPC Barmer** (`gpcbarmer`)
- **GPC Bharatpur** (`gpcbharatpur`)
- **GPC Bhilwara** (`gpcbhilwara`)
- **GPC Bundi** (`gpcbundi`)
- **GPC Chittorgarh** (`gpcchittorgarh`)
- **DTE Rajasthan Central Policy** (`general_rajasthan_dte`)

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root service info and status |
| `GET` | `/health` | Healthcheck (FAISS status, model, loaded colleges) |
| `GET` | `/colleges` | Returns all supported colleges with cutoff metadata |
| `GET` | `/news` | Returns latest DTE circulars and news announcements |
| `POST` | `/predict_colleges` | Predicts eligible colleges based on student score and category |
| `POST` | `/ask_query` | Submits multilingual question to RAG pipeline |
