from beanie import Document
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class Classroom(Document):
    name: str
    teacher_id: str
    description: Optional[str] = None

    whiteboard_id: Optional[str] = None
    
    created_at: datetime = datetime.now()
    student_ids: List[str] = []

    class Settings:
        name = "classrooms" #numele tabelului in Mongo


        