from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models import User
from app.core.config import settings
from app.models.whiteboard import Whiteboard
from app.models.classroom import Classroom


async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]
    await init_beanie(database=db, document_models=[User, Whiteboard, Classroom])
