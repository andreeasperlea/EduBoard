from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models import User
from app.core.config import settings
from app.models.whiteboard import Whiteboard
from app.models.classroom import Classroom
from app.models.attendance import AttendanceSession
from app.models.assignment import Assignment, Submission
from app.models.conversation import Conversation


async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]
    await init_beanie(database=db, document_models=[User, Whiteboard, Classroom, AttendanceSession, Assignment, Submission, Conversation])
 
 #adaugat entitatile noi AttendanceSession, Assignment, Submission, Conversation