# FILE: backend/app/models/classroom.py
import uuid
from beanie import Document
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class Resource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    type: str = "link"
    url: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
#adaugat clasele Resource si Announcement pentru a le putea fi folsoi ca si clase compuse in CLassroom
class Announcement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    author_name: str
    posted_at: datetime = Field(default_factory=datetime.utcnow)

class Classroom(Document):
    name: str
    teacher_id: str
    description: Optional[str] = None
    whiteboard_id: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.now)
    student_ids: List[str] = []

    announcements: List[Announcement] = []
    resources: List[Resource] = []

    class Settings:
        name = "classrooms"