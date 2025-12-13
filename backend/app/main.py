from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, dashboard, whiteboard, classes   # <-- ADD THIS
from app.db.database import init_db
from app.api.v1 import ai_assistant

app = FastAPI(title="EduBoard API", debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])

app.include_router(whiteboard.router, prefix="/api/v1/whiteboards", tags=["whiteboard"]) 

app.include_router(classes.router, prefix="/api/v1/classes", tags=["classes"])

app.include_router(ai_assistant.router, prefix="/api/v1/ai", tags=["ai"])