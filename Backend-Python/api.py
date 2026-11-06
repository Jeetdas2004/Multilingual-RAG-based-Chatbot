import logging
import json
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from model import chat_with_rag, get_or_initialize_faiss_index, DATA_DIR

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pragya_api")

app = FastAPI(
    title="Pragya — Multilingual RAG Chatbot API",
    description="Department of Technical Education (DTE), Rajasthan — Student Assistance System",
    version="2.0.0"
)

# Allow all origins for seamless development and widget embedding
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query: str
    college_name: Optional[str] = "gpcajmer"
    lang: Optional[str] = "English"

class PredictRequest(BaseModel):
    score: float
    category: Optional[str] = "General"
    preferred_branch: Optional[str] = None

# Pre-defined list of Rajasthan Colleges
COLLEGES_META = [
    {"name": "Government Polytechnic College, Ajmer", "minScore": 82, "value": "gpcajmer", "city": "Ajmer"},
    {"name": "Government Polytechnic College, Alwar", "minScore": 78, "value": "gpcalwar", "city": "Alwar"},
    {"name": "Government Polytechnic College, Jaipur", "minScore": 86, "value": "gpcjaipur", "city": "Jaipur"},
    {"name": "Government Polytechnic College, Jodhpur", "minScore": 81, "value": "gpcjodhpur", "city": "Jodhpur"},
    {"name": "Government Polytechnic College, Kota", "minScore": 80, "value": "gpckota", "city": "Kota"},
    {"name": "Government Polytechnic College, Bikaner", "minScore": 79, "value": "gpcbikaner", "city": "Bikaner"},
    {"name": "Government Polytechnic College, Banswara", "minScore": 73, "value": "gpcbanswara", "city": "Banswara"},
    {"name": "Government Polytechnic College, Baran", "minScore": 74, "value": "gpcbaran", "city": "Baran"},
    {"name": "Government Polytechnic College, Barmer", "minScore": 70, "value": "gpcbarmer", "city": "Barmer"},
    {"name": "Government Polytechnic College, Bharatpur", "minScore": 72, "value": "gpcbharatpur", "city": "Bharatpur"},
    {"name": "Government Polytechnic College, Bhilwara", "minScore": 74, "value": "gpcbhilwara", "city": "Bhilwara"},
    {"name": "Government Polytechnic College, Bundi", "minScore": 75, "value": "gpcbundi", "city": "Bundi"},
    {"name": "Government Polytechnic College, Chittorgarh", "minScore": 72, "value": "gpcchittorgarh", "city": "Chittorgarh"},
    {"name": "DTE Rajasthan (General Inquiries)", "minScore": 60, "value": "general_rajasthan_dte", "city": "Statewide"}
]

NEWS_ITEMS = [
    {
        "id": 1,
        "title": "DTE Rajasthan Polytechnic Admissions 2026 Announced",
        "description": "Department of Technical Education opens online registration for 1st Year Diploma and Lateral Entry 2nd Year courses on hte.rajasthan.gov.in.",
        "category": "Admissions",
        "date": "November 2026"
    },
    {
        "id": 2,
        "title": "100% Tuition Fee Exemption for Female Students in Govt Colleges",
        "description": "Rajasthan Government reinforces zero tuition fee policy for all female candidates admitted to government polytechnic and technical institutes.",
        "category": "Scholarships",
        "date": "2026-27"
    },
    {
        "id": 3,
        "title": "Post-Matric Scholarship Applications Open on SJED Portal",
        "description": "SC, ST, OBC (BPL), and EWS students can submit applications for complete tuition fee reimbursement through the SSO scholarship portal.",
        "category": "Financial Aid",
        "date": "Active"
    },
    {
        "id": 4,
        "title": "New Renewable Energy & Solar Tech Labs Inaugurated at GPC Bikaner",
        "description": "Advanced solar simulation and testing laboratories commissioned to train diploma students for Rajasthan's expanding clean energy sector.",
        "category": "Infrastructure",
        "date": "Recent"
    },
    {
        "id": 5,
        "title": "Campus Placement Drive: Top Automotive and Core Giants Visit GPC Campuses",
        "description": "Tata Motors, L&T, Maruti Suzuki, and Havells recruit over 450 diploma engineers with packages ranging up to ₹5.50 LPA.",
        "category": "Placements",
        "date": "Campus Update"
    }
]

@app.get("/")
def read_root():
    return {
        "service": "Pragya — Multilingual RAG Chatbot API",
        "status": "Online",
        "version": "2.0.0",
        "department": "Department of Technical Education, Government of Rajasthan",
        "endpoints": {
            "ask_query": "POST /ask_query",
            "colleges": "GET /colleges",
            "predict": "POST /predict_colleges",
            "news": "GET /news",
            "health": "GET /health"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "vector_engine": "FAISS (Cosine Inner Product)",
        "embedding_model": "all-MiniLM-L6-v2",
        "knowledge_base": "Department of Technical Education, Rajasthan",
        "colleges_loaded": len(COLLEGES_META)
    }

@app.get("/colleges")
def get_colleges():
    """Returns the full list of available colleges."""
    return {"colleges": COLLEGES_META}

@app.get("/news")
def get_news():
    """Returns the latest college and admission news announcements."""
    return {"news": NEWS_ITEMS}

@app.post("/predict_colleges")
def predict_colleges(req: PredictRequest):
    """
    Predicts eligible colleges based on student's percentage/score and category.
    Adjusts cutoff requirements according to category relaxation rules.
    """
    score = req.score
    category = (req.category or "General").upper()
    
    # Category cutoff relaxation:
    # OBC: 3% relaxation, SC/ST: 8% relaxation, EWS: 2% relaxation
    relaxation = 0.0
    if "OBC" in category:
        relaxation = 3.0
    elif "SC" in category or "ST" in category:
        relaxation = 8.0
    elif "EWS" in category:
        relaxation = 2.0
    
    adjusted_score = score + relaxation
    
    predictions = []
    for college in COLLEGES_META:
        if college["value"] == "general_rajasthan_dte":
            continue
        min_cutoff = college["minScore"]
        
        chance = "Low"
        if adjusted_score >= min_cutoff + 3:
            chance = "High"
        elif adjusted_score >= min_cutoff - 3:
            chance = "Moderate"
        elif adjusted_score >= min_cutoff - 7:
            chance = "Competitive"
        else:
            chance = "Reach"
            
        predictions.append({
            "name": college["name"],
            "city": college["city"],
            "value": college["value"],
            "minScore": min_cutoff,
            "studentScore": score,
            "chance": chance,
            "eligible": adjusted_score >= (min_cutoff - 3)
        })
    
    # Sort eligible ones first, then closest cutoff
    predictions.sort(key=lambda x: (not x["eligible"], x["minScore"]), reverse=False)
    
    return {
        "student_score": score,
        "category": req.category,
        "recommended_colleges": predictions[:6]
    }

@app.post("/ask_query")
async def ask_query(query: Query):
    try:
        college_code = query.college_name.strip() if query.college_name else "gpcajmer"
        lang = query.lang.strip() if query.lang else "English"
        user_text = query.query.strip()
        
        if not user_text:
            raise HTTPException(status_code=400, detail="Query cannot be empty.")
            
        logger.info(f"Received query: '{user_text}' | College: {college_code} | Lang: {lang}")
        
        # Load or retrieve FAISS index for this college
        index_data = get_or_initialize_faiss_index(college_code)
        
        # Run RAG answer generation
        response = chat_with_rag(user_text, index_data, lang, college_name=college_code)
        logger.info(f"Successfully answered query for {college_code}")
        
        return {
            "answer": response,
            "college_name": college_code,
            "lang": lang,
            "status": "success"
        }
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}", exc_info=True)
        # Even on unexpected error, provide graceful answer
        return {
            "answer": f"We encountered an issue retrieving detailed data. For direct assistance, please contact the DTE Rajasthan Student Helpline at **1800-180-6127** or visit [hte.rajasthan.gov.in](https://hte.rajasthan.gov.in).",
            "college_name": query.college_name,
            "lang": query.lang,
            "status": "partial"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
