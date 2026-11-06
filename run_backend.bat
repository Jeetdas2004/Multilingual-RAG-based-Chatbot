@echo off
echo =======================================================
echo   Starting Pragya AI Backend (FastAPI + RAG Engine)
echo   Department of Technical Education, Rajasthan
echo =======================================================
cd /d "%~dp0Backend-Python"

if exist venv\Scripts\python.exe (
    echo Using Virtual Environment Python...
    venv\Scripts\python.exe -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
) else (
    echo Virtual environment not found, attempting global python...
    python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
)
pause

